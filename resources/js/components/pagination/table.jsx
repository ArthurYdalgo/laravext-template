import { Table as TableComponent } from "@/components/ui/table";
import Paginated from "./paginated";

export default function Table ({
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
}) {
    return (
        <>
            <Paginated
                compactLinks={compactLinks}
                params={params}
                sortKeyLimit={sortKeyLimit}
                resetPageWhenParamsChange={resetPageWhenParamsChange}
                initialPagination={initialPagination}
                onPaginationUpdated={onPaginationUpdated}
                endpoint={endpoint}
                fillInMissingItems={fillInMissingRows}
                paginated={({pagination, handleSortBy}) => (
                    <div className="w-full">
                        <div className="">
                            <div
                                className={`overflow-hidden  overflow-x-auto border ring-1 ring-black/5 sm:rounded-lg ${
                                    pagination?.data.length == 0 &&
                                    !pagination.initialLoad
                                        ? extendTableWhenNotEmpty
                                            ? "min-h-[50vh]"
                                            : ""
                                        : extendTableWhenEmpty
                                        ? "min-h-[50vh]"
                                        : ""
                                }`}
                            >
                                <TableComponent
                                    className={`min-w-full divide-y divide-gray-300 ${
                                        pagination.loading ? "opacity-50" : ""
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
                        </div>
                    </div>
                )}
            />
        </>
    );
};
