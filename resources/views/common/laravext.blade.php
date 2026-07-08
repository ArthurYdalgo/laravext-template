<script id="laravext-scripts" nonce="{{ app('csp-nonce') }}">
    window.__laravext = {
        page_data: {!! json_encode($laravext_page_data ?? []) !!}
    };
</script>