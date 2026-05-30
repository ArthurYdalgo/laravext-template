import { Table as TableComponent } from "@/components/ui/table";
import Paginated from "./paginated";

export default function Table({
    endpoint,
    params,
    initialPagination = {},
    resetPageWhenParamsChange = [],
    compactLinks = true,
    tableHead = ({ sortBy, handleClick }) => null,
    tableClassName = "",
    sortKeyLimit = null,
    tableBody = (pagination) => null,
    onPaginationUpdated = (pagination) => null,
    extendTableWhenEmpty = true,
    extendTableWhenNotEmpty = true,
    fillInMissingRows = false,
    hideTableHeadOnMobile = false,
    hideTableBodyOnMobile = false,
    responsiveTableBody = null,
}) {
    return (
        <Paginated
            compactLinks={compactLinks}
            params={params}
            sortKeyLimit={sortKeyLimit}
            resetPageWhenParamsChange={resetPageWhenParamsChange}
            initialPagination={initialPagination}
            onPaginationUpdated={onPaginationUpdated}
            endpoint={endpoint}
            fillInMissingItems={fillInMissingRows}
            paginated={({ pagination, handleSortBy }) => (
                <div className="w-full min-w-0 max-w-full">
                    {/* Standard Table View */}
                    <div
                        className={`overflow-hidden overflow-x-hidden border border-gray-200 dark:border-zinc-800 ring-1 ring-black/5 dark:ring-white/5 sm:rounded-lg ${
                            pagination?.data.length == 0 && !pagination.initialLoad
                                ? extendTableWhenNotEmpty
                                    ? "min-h-[50vh]"
                                    : ""
                                : extendTableWhenEmpty
                                ? "min-h-[50vh]"
                                : ""
                        } ${
                            hideTableHeadOnMobile && hideTableBodyOnMobile 
                                ? "hidden md:block" 
                                : "block"
                        } w-full max-w-full`}
                    >
                        <TableComponent
                            className={`min-w-full divide-y divide-gray-300 dark:divide-zinc-800 ${
                                pagination.loading ? "opacity-50" : ""
                            } ${hideTableHeadOnMobile ? "[&_thead]:hidden md:[&_thead]:table-header-group" : ""} ${
                                hideTableBodyOnMobile ? "[&_tbody]:hidden md:[&_tbody]:table-row-group" : ""
                            } ${tableClassName}`}
                        >
                            {tableHead({
                                sortBy: pagination.sortBy,
                                handleClick: (field, value) => {
                                    handleSortBy(field, value);
                                },
                            })}
                            {tableBody(pagination)}
                        </TableComponent>
                    </div>

                    {/* Mobile Responsive Body */}
                    {responsiveTableBody && (
                        <div className="block md:hidden mt-4 w-full min-w-0 max-w-full">
                            {responsiveTableBody(pagination)}
                        </div>
                    )}
                </div>
            )}
        />
    );
}