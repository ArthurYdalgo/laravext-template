import React from "react";
import { Label } from "@/components/ui/label"; // shadcn
// Optional: use your shadcn cn() util. Keeping a tiny inline version:
import { cn } from "@/lib/utils";
/**
 * FormSection
 *  - title: string | ReactNode
 *  - subtitle: string | ReactNode
 *  - titleSide: "left" | "right"  (default "right" to match your spec)
 *  - titleWidth: Tailwind width class for the title column on md+ (default "md:w-64")
 *  - className: extra classes for the outer wrapper
 *
 * Layout:
 *  - Mobile: stacked
 *  - md+: two columns; title/subtitle on chosen side, fields on the other
 */
export function FormSection({
  title,
  subtitle,
  titleSide = "left",
  titleWidth = "md:w-64",
  className,
  children,
}) {
  const titleBlock = (
    <div className={cn("space-y-1")}>
      {typeof title === "string" ? (
        <h3 className="text-base font-medium leading-none tracking-tight">{title}</h3>
      ) : (
        title
      )}
      {subtitle ? (
        typeof subtitle === "string" ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : (
          subtitle
        )
      ) : null}
    </div>
  );

  const left = titleSide === "left" ? titleBlock : children;
  const right = titleSide === "left" ? children : titleBlock;

  return (
    <section
      className={cn(
        "border-b pb-6 last:border-b-0 last:pb-0",
        "grid grid-cols-1 gap-4 md:grid-cols-[1fr] md:gap-6",
        className
      )}
    >
      {/* On md+, make it two columns with a fixed title width */}
      <div className={cn("md:flex md:gap-6")}>
        {/* Title column */}
        <div className={cn("mb-2 md:mb-0", titleWidth)}>
          {left === titleBlock ? titleBlock : null}
          {left !== titleBlock ? null : null}
        </div>

        {/* Content column (grows) */}
        <div className="flex-1">
          {left === titleBlock ? children : titleBlock}
        </div>
      </div>
    </section>
  );
}

/**
 * FormRow
 *  - cols: number of columns in this row (default 12)
 *  - gap: tailwind gap-x (default 4)
 *  - className: additional classes
 *
 * Use multiple FormRow per section to control vertical grouping.
 */
export function FormRow({ cols = 12, gap = 4, className, children }) {
  return (
    <div
      className={cn(
        // mobile: 1 col; md+: grid with N columns
        "grid grid-cols-1 md:grid-cols-12",
        // set custom CSS var for spans
        // we just rely on md:col-span-* on children
        `gap-y-3 md:gap-x-${gap}`,
        className
      )}
      // Note: Tailwind won't generate dynamic class for gap-x-${gap} unless in safelist.
      // If you want free-form gaps, swap to a style prop:
      // style={{ columnGap: `var(--gap, 1rem)` }} and set inline.
    >
      {/*
        Tip: If you use arbitrary values frequently, consider:
        className="grid grid-cols-1 md:[grid-template-columns:repeat(12,minmax(0,1fr))] gap-y-3 md:gap-x-4"
      */}
      {children}
    </div>
  );
}

/** FormActions
 *  - className: additional classes
 *
 * Right-aligned container for form buttons.
 */
export function FormActions({ children, className }) {
  return (
    <div className={cn("flex justify-end pt-4", className)}>
      {children}
    </div>
  );
}

/**
 * FormField
 *  - span: how many columns to take on md+ (default 12 = full width)
 *  - label: optional label text (shadcn Label)
 *  - htmlFor: id to link label to input
 *  - description: small help text under the field
 *  - required: show a red asterisk (visual only)
 *  - className: wrapper classes
 *
 * Put your actual input/select/etc. as children.
 */
export function FormField({
  span = 12,
  label,
  htmlFor,
  description,
  error,
  insertEmptyLabel = false, // if no label, insert an invisible one for a11y alignment
  required,
  className,
  children,
}) {
  // Tailwind needs col-span classes to exist at build-time.
  // We'll map the small set 1..12.
  const spanClass =
    {
      1: "md:col-span-1",
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4",
      5: "md:col-span-5",
      6: "md:col-span-6",
      7: "md:col-span-7",
      8: "md:col-span-8",
      9: "md:col-span-9",
      10: "md:col-span-10",
      11: "md:col-span-11",
      12: "md:col-span-12",
    }[span] || "md:col-span-12";

  return (
    <div className={cn("flex flex-col gap-1", spanClass, className)}>
      {label ? (
        <Label htmlFor={htmlFor} className="text-sm whitespace-nowrap">
          {label} {required ? <span className="text-destructive whitespace-nowrap">*</span> : null}
        </Label>
      ) : (insertEmptyLabel ? <Label className="opacity-0 text-sm whitespace-nowrap">|</Label> : null)} {/* for a11y if no label */}
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}