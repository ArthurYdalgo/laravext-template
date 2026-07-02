export function TableBannerGroup({ children, className = "", responsive = true }) {
    return (
        <div 
            className={`flex min-w-0 ${
                responsive 
                    ? "flex-col items-stretch w-full gap-4 md:flex-row md:items-end md:w-auto" 
                    : "flex-row items-end gap-4 w-full md:w-auto"
            } ${className}`}
        >
            {children}
        </div>
    );
}

export function TableBanner({ 
    actionComponents, 
    filterComponents, 
    className = "", 
    enableResponsiveMode = true 
}) {
    return (
        <div 
            className={`flex w-full min-w-0 max-w-full box-border ${
                enableResponsiveMode 
                    ? "flex-col gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm md:flex-row md:justify-between md:items-end md:bg-transparent md:dark:bg-transparent md:p-0 md:rounded-none md:border-none md:shadow-none" 
                    : "flex-row justify-between items-end gap-4"
            } ${className}`}
        >
            {filterComponents && (
                <TableBannerGroup responsive={enableResponsiveMode}>
                    {enableResponsiveMode && (
                        <div className="md:hidden font-bold text-xl mb-1 text-gray-900 dark:text-gray-100 w-full">Filter</div>
                    )}
                    {filterComponents}
                </TableBannerGroup>
            )}
            
            {actionComponents && (
                <TableBannerGroup responsive={enableResponsiveMode}>
                    {actionComponents}
                </TableBannerGroup>
            )}
        </div>
    );
}