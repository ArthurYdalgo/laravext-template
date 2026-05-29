import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import { SelectItem } from '@radix-ui/react-select';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useState from 'react-usestateref';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

export default function Links({
    pagination,
    hidePageInput = false,
    hidePerPageSelector = false,
    hidePageSelector = false,
    showGoToStartButton = false,
    showGoToEndButton = false,
    hideTotal = false,
    compact = true,
    responsive = true,
    onPaginateTo,
    perPageOptions = [5, 8, 10, 15, 25, 50, 100],
    className = '',
    ...props
}) {
    const [perPage, setPerPage] = useState(pagination.meta.per_page);
    const [currentPage, setCurrentPage, currentPageRef] = useState(pagination.meta.current_page);
    const [currentPageInput, setCurrentPageInput, currentPageInputRef] = useState(pagination.meta.current_page);
    const pageRange = 1;

    const { t } = useTranslation();

    const pages = useMemo(() => {
        const total = pagination.meta.last_page;

        // Build the core set: first, current, last
        const pageNumbers = (compact ? [1, currentPage, total] : [1, currentPage - 1, currentPage, currentPage + 1, total])
            .filter((n, index, self) => n >= 1 && n <= total && self.indexOf(n) === index) // Remove duplicates
            .sort((a, b) => a - b);

        // Inject ellipsis for gaps >1
        const pagesArray = [];
        for (let i = 0; i < pageNumbers.length; i++) {
            if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
                pagesArray.push('...');
            }
            pagesArray.push(pageNumbers[i]);
        }

        return pagesArray;
    }, [pagination.meta.last_page, currentPage]);

    const paginateTo = () => {
        onPaginateTo({ page: currentPage, perPage });
    };

    const handleUpdatePerPage = (e) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const onBlur = () => {
        let value = currentPageInputRef.current;

        if (value == currentPageRef.current) {
            return;
        }

        if (value > pagination.meta.last_page) {
            value = pagination.meta.last_page;
        }

        if (value < 1) {
            value = 1;
        }

        setCurrentPageInput(value);
        setCurrentPage(value);
    };

    useNonInitialEffect(() => {
        paginateTo();
        setCurrentPageInput(currentPage);
    }, [perPage, currentPage]);

    useNonInitialEffect(() => {
        if (pagination.meta.current_page !== currentPage) {
            setCurrentPage(pagination.meta.current_page);
            setCurrentPageInput(pagination.meta.current_page);
        }
    }, [pagination.meta.current_page]);

    return (
        <div 
            className={`flex items-center justify-between w-full min-w-0 gap-4 ${
                responsive ? 'flex-col md:flex-row' : 'flex-row'
            } ${className}`} 
            {...props}
        >
            <div className={`flex items-center min-w-0 ${
                responsive ? 'justify-center md:justify-start w-full md:w-auto' : 'justify-start w-auto'
            }`}>
                {!hideTotal && (
                    <label htmlFor="per-page-selector" className={`text-sm text-gray-500 dark:text-zinc-400 break-words ${
                        responsive ? 'text-center md:text-left' : 'text-left'
                    }`}>
                        {t('pagination.showing_of_results', {
                            from: pagination.meta.from,
                            to: pagination.meta.to,
                            total: pagination.meta.total,
                        })}
                    </label>
                )}
            </div>

            {!hidePageSelector && (
                <Pagination className={`mx-0 min-w-0 flex ${
                    responsive ? 'w-full md:w-auto justify-center md:justify-end' : 'w-auto justify-end'
                }`}>
                    <PaginationContent className={`gap-y-3 gap-x-1 ${
                        responsive ? 'flex-wrap justify-center' : 'flex-nowrap'
                    }`}>
                        
                        {/* 1. PER PAGE SELECTOR (Moved to Row 2 on mobile via order-2) */}
                        {!hidePerPageSelector && (
                            <PaginationItem className={`${responsive ? 'order-2 md:order-none mt-2 md:mt-0 mr-2 md:mr-0' : ''}`}>
                                <Select
                                    value={String(perPage)}
                                    onValueChange={(value) => handleUpdatePerPage({ target: { value } })}
                                >
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue>{perPage}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="w-[80px]">
                                        {perPageOptions.map((option) => (
                                            <SelectItem key={option} value={String(option)} className="hover:bg-gray-100 p-1 dark:hover:bg-gray-700 cursor-pointer">
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </PaginationItem>
                        )}

                        {!hidePerPageSelector && !hidePageSelector && (
                            <Separator orientation="vertical" className={`mx-2 h-6 ${
                                responsive ? 'hidden md:block md:order-none' : 'block'
                            }`} />
                        )}

                        {/* 2. PAGE NUMBERS (Kept on Row 1 on mobile via order-1) */}
                        <PaginationItem className={`${responsive ? 'order-1 md:order-none' : ''}`}>
                            <PaginationPrevious disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                        </PaginationItem>
                        
                        {pages.map((page, index) => (
                            <PaginationItem key={`paginator-${page}-${index}`} className={`${responsive ? 'order-1 md:order-none' : ''}`} onClick={() => typeof page === 'number' && setCurrentPage(page)}>
                                {typeof page === 'number' ? (
                                    <PaginationLink isActive={page == currentPage}>{page}</PaginationLink>
                                ) : (
                                    <PaginationEllipsis />
                                )}
                            </PaginationItem>
                        ))}
                        
                        <PaginationItem className={`${responsive ? 'order-1 md:order-none' : ''}`}>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.meta.last_page))}
                                disabled={currentPage === pagination.meta.last_page}
                            />
                        </PaginationItem>

                        {/* 3. ROW BREAK ELEMENT: This invisible element forces everything with order-2 beneath the page numbers */}
                        {responsive && (
                            <li className="basis-full h-0 block md:hidden order-1" aria-hidden="true"></li>
                        )}

                        {!hidePageSelector && !hidePageInput && (
                            <Separator orientation="vertical" className={`mx-2 h-6 ${
                                responsive ? 'hidden md:block md:order-none' : 'block'
                            }`} />
                        )}
                        
                        {/* 4. GO TO PAGE INPUT (Moved to Row 2 on mobile via order-2) */}
                        {!hidePageInput && (
                            <PaginationItem className={`${responsive ? 'order-2 md:order-none mt-2 md:mt-0 ml-2 md:ml-0' : ''}`}>
                                <Input
                                    id="current-page-input"
                                    type="number"
                                    value={currentPageInput}
                                    onChange={(e) => setCurrentPageInput(e.target.value)}
                                    max={pagination.meta.last_page}
                                    onBlur={onBlur}
                                    className="w-16 h-9 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}