export function TableBannerGroup ({children}) {
    return (<div className="space-x-2 flex items-end">
        {children}
    </div>)
}

export function TableBanner ({ actionComponents, filterComponents, className = '' }) {
    return (
        <div className={"h-14 flex justify-between " + className}>
            <TableBannerGroup>{filterComponents}</TableBannerGroup>
            <TableBannerGroup>{actionComponents}</TableBannerGroup>
        </div>
    );
}
