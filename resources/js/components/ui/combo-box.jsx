import React, { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNonInitialEffect } from "@/hooks/use-non-initial-effect"

export function ComboBox({
  items = [],
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  buttonClassName = "",
  popoverContentClassName = "",
  disabled = false,
  searchEndpoint = null,
  parseItem = (item) => ({ value: String(item.id ?? ""), label: item.name ?? "", keywords: [] }),
  minChars = 0,
  debounceMs = 300,
  extraParams = {},
  parseSearch = (q) => ({ "filter[search]": q }),
  prefetchOptions = false,
  fetchOnOpen = false,
  prefetchedOptions = null
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // remote results (from server)
  const [remoteItems, setRemoteItems] = useState([])
  // parsed prefetched options (always included/merged with remote)
  const [prefetchedParsed, setPrefetchedParsed] = useState([])

  const abortRef = useRef(null)
  const debounceRef = useRef(null)
  const lastFetchedQueryRef = useRef(null)
  const didPrefetchRef = useRef(false)

  // cache to resolve label instantly even if the item isn’t in current list
  const labelCacheRef = useRef(new Map())
  const cacheItems = (arr) => {
    const map = labelCacheRef.current
    for (const it of arr) map.set(String(it.value), it.label ?? "")
  }

  // parse + cache local (non-remote) items
  useEffect(() => {
    if (searchEndpoint) return
    const normalized = (items || []).map((r) => {
      const p = r && typeof r === "object" && "value" in r && "label" in r ? r : (parseItem(r) || {})
      return { value: String(p.value ?? ""), label: p.label ?? "", keywords: Array.isArray(p.keywords) ? p.keywords : [] }
    })
    cacheItems(normalized)
  }, [items, searchEndpoint, parseItem])

  // parse + store + cache prefetchedOptions (always kept/merged with remote)
  useEffect(() => {
    if (!searchEndpoint) return
    if (!prefetchedOptions || !Array.isArray(prefetchedOptions) || prefetchedOptions.length === 0) {
      setPrefetchedParsed([])
      return
    }
    const parsed = prefetchedOptions.map((r) => {
      const p = parseItem(r) || {}
      return {
        value: String(p.value ?? ""),
        label: p.label ?? "",
        keywords: Array.isArray(p.keywords) ? p.keywords : []
    }})
    setPrefetchedParsed(parsed)
    cacheItems(parsed)
    // mark as prefetched for the empty query
    didPrefetchRef.current = true
    if (lastFetchedQueryRef.current == null) lastFetchedQueryRef.current = ""
  }, [searchEndpoint, prefetchedOptions, parseItem])

  // merge logic: when remote search is enabled, show prefetched + remote (dedup by value; prefer remote)
  const effectiveItems = useMemo(() => {
    if (!searchEndpoint) return items
    // build map with prefetched first, then overwrite with remote to prefer server labels
    const map = new Map()
    for (const it of prefetchedParsed) map.set(String(it.value), it)
    for (const it of remoteItems) map.set(String(it.value), it)
    const combined = Array.from(map.values())
    return combined
  }, [searchEndpoint, prefetchedParsed, remoteItems, items])

  const displayLabel = useMemo(() => {
    const found = effectiveItems.find((it) => String(it.value) === String(value))
    if (found) return found.label
    return labelCacheRef.current.get(String(value)) ?? null
  }, [effectiveItems, value])

  const runSearch = async (q) => {
    if (!searchEndpoint) return
    if ((q || "").length < minChars) {
      // clear only the remote portion; prefetched stay included via merge
      setRemoteItems([])
      setLoading(false)
      setError(null)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const spec = parseSearch(q)
      let res
      if (typeof spec === "string") {
        const url = spec.trim().length ? `${searchEndpoint}?${spec}` : searchEndpoint
        res = await axios.get(url, { signal: controller.signal })
      } else {
        const params = { ...(spec || {}), ...extraParams }
        res = await axios.get(searchEndpoint, { params, signal: controller.signal })
      }

      const raw = res?.data?.data ?? []
      const parsed = raw.map((r) => {
        const p = parseItem(r) || {}
        return {
          value: String(p.value ?? ""),
          label: p.label ?? "",
          keywords: Array.isArray(p.keywords) ? p.keywords : []
        }
      })
      setRemoteItems(parsed)
      cacheItems(parsed)
      lastFetchedQueryRef.current = q
    } catch (err) {
      if (axios.isCancel(err) || err?.name === "CanceledError") {
        // ignore
      } else {
        setError("Failed to fetch results.")
        setRemoteItems([])
      }
    } finally {
      setLoading(false)
    }
  }

  // debounced fetch on open/typing (remote mode)
  useNonInitialEffect(() => {
    if (!searchEndpoint || !open) return
    if (!fetchOnOpen && query.length === 0) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // skip if we already fetched this exact query and have remote items
      if (
        (prefetchOptions || didPrefetchRef.current) &&
        lastFetchedQueryRef.current === query &&
        (remoteItems?.length ?? 0) > 0
      ) {
        return
      }
      runSearch(query)
    }, debounceMs)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, open, searchEndpoint, debounceMs, prefetchOptions, fetchOnOpen])

  // abort on close
  useNonInitialEffect(() => {
    if (!searchEndpoint) return
    if (!open && abortRef.current) abortRef.current.abort()
  }, [open, searchEndpoint])

  // optional prefetch on mount/endpoint change (remote mode)
  useNonInitialEffect(() => {
    if (!searchEndpoint || !prefetchOptions) return
    ;(async () => {
      await runSearch(query)
      didPrefetchRef.current = true
    })()
  }, [searchEndpoint, prefetchOptions])

  // cleanup
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={"w-[200px]  justify-between " + buttonClassName}
        >
          {displayLabel || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-[280px] p-0 " + popoverContentClassName} onCloseAutoFocus={() => setQuery("")}>
        {/* always enable client-side filtering so prefetched+remote can be searched together */}
        <Command shouldFilter>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 border-none focus:ring-0"
            onValueChange={setQuery}
            value={query}
          />
          <CommandList>
            {loading && (
              <CommandGroup>
                <div className="px-3 py-2 text-sm opacity-70">Searching…</div>
              </CommandGroup>
            )}

            {!loading && error && (
              <CommandGroup>
                <div className="px-3 py-2 text-sm text-red-600">{error}</div>
              </CommandGroup>
            )}

            {!loading && !error && effectiveItems.length === 0 && (
              <CommandEmpty>No item found.</CommandEmpty>
            )}

            {!loading && !error && effectiveItems.length > 0 && (
              <CommandGroup>
                {effectiveItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={String(item.value)}
                    keywords={
                      typeof item.label === "string"
                        ? [item.label, ...(item.keywords ?? [])]
                        : (item.keywords ?? [])
                    }
                    onSelect={() => {
                      const id = String(item.value)
						console.log({id, value})
					  if(String(id) === String(value)){
						  // selecting the same value again closes the popover without changing anything
						  setOpen(false)
						  onChange(null)
						  setQuery("")
						  return
					  }

                      onChange(id)
                      labelCacheRef.current.set(id, item.label ?? "")
					  setQuery("")
                      setOpen(false)
                    }}
                  >
                    {item.label}
                    <Check className={`ml-auto ${String(value) === String(item.value) ? "opacity-100" : "opacity-0"}`} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
