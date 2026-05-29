export function TableBannerGroup({ children, className = "", responsive = false }) {
    return (
        <div 
            className={`flex items-end ${
                responsive 
                    ? "max-md:flex-col max-md:items-stretch max-md:w-full max-md:gap-4 max-md:space-x-0 md:space-x-2" 
                    : "space-x-2"
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
            className={`flex justify-between ${
                enableResponsiveMode 
                    ? "max-md:flex-col max-md:gap-4 max-md:bg-white max-md:p-5 max-md:rounded-xl max-md:border max-md:shadow-sm md:h-14" 
                    : "h-14"
            } ${className}`}
        >
            <TableBannerGroup responsive={enableResponsiveMode}>
                {/* Mobile Filter Header Label */}
                {enableResponsiveMode && filterComponents && (
                    <div className="md:hidden font-bold text-xl mb-1 text-gray-900">Filter</div>
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