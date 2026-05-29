export function TableBannerGroup({ children, className = "", responsive = false }) {
    return (
        <div 
            className={`flex ${
                responsive 
                    ? "flex-col items-stretch w-full gap-4 md:flex-row md:items-end md:w-auto md:gap-0 md:space-x-2" 
                    : "items-end space-x-2"
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
    enableResponsiveMode = false 
}) {
    return (
        <div 
            className={`flex w-full ${
                enableResponsiveMode 
                    ? "flex-col gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm md:flex-row md:justify-between md:gap-0 md:bg-transparent md:dark:bg-transparent md:p-0 md:rounded-none md:border-none md:shadow-none md:h-14" 
                    : "justify-between h-14"
            } ${className}`}
        >
            <TableBannerGroup responsive={enableResponsiveMode}>
                {/* Mobile Filter Header Label */}
                {enableResponsiveMode && filterComponents && (
                    <div className="md:hidden font-bold text-xl mb-1 text-gray-900 dark:text-gray-100">Filter</div>
                )}
                {filterComponents}
            </TableBannerGroup>
            
            {actionComponents && (
                <TableBannerGroup responsive={enableResponsiveMode}>
                    {actionComponents}
                </TableBannerGroup>
            )}
        </div>
    );
}