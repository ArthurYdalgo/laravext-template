import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 1. We create a controlled wrapper to override Radix's default mobile behavior.
// This forces the tooltip to toggle open/closed instantly on tap.
const TapTooltip = ({ content, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Tooltip open={isOpen} onOpenChange={setIsOpen} delayDuration={150}>
            <TooltipTrigger asChild>
                {/* We clone the child element to inject an explicit onClick toggle */}
                {React.cloneElement(children, {
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpen((prev) => !prev);
                    }
                })}
            </TooltipTrigger>
            <TooltipContent 
                side="top" 
                // Ensure z-50 so it pops above other cards on mobile
                className="max-w-[85vw] break-all sm:break-words text-center z-50 shadow-md"
                onInteractOutside={() => setIsOpen(false)}
            >
                {content}
            </TooltipContent>
        </Tooltip>
    );
};

export default function MobileDataCard({
    title,
    titleTruncatePosition = "end",
    checkbox,
    actions,
    mainProps = [],
    minorProps = [],
    fakeViewMore,
    viewMoreText = "View More",
    viewLessText = "View Less",
    onViewMore,
    onViewLess,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExpand = () => {
        if (isExpanded) {
            // Currently expanded, user clicked "View Less"
            const collapse = () => setIsExpanded(false);
            
            if (onViewLess) {
                onViewLess(collapse);
            } else {
                collapse();
            }
        } else {
            // Currently collapsed, user clicked "View More"
            const expand = () => setIsExpanded(true);
            
            if (onViewMore) {
                onViewMore(expand);
            } else {
                expand();
            }
        }
    };

    const renderTitleText = () => {
        if (titleTruncatePosition === "middle" && typeof title === "string" && title.length > 12) {
            const start = title.slice(0, -6);
            const end = title.slice(-6);
            return (
                <div className="flex items-center w-full min-w-0 font-semibold text-gray-900 dark:text-gray-100 text-left overflow-hidden">
                    <span className="truncate min-w-0">{start}</span>
                    <span className="shrink-0 whitespace-nowrap">{end}</span>
                </div>
            );
        }

        return (
            <span className="font-semibold text-gray-900 dark:text-gray-100 block w-full truncate whitespace-nowrap text-left">
                {title}
            </span>
        );
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return null;

        if (typeof value === "string" || typeof value === "number") {
            const text = String(value);
            return (
                <TapTooltip content={text}>
                    <button type="button" className="block w-full truncate text-right whitespace-nowrap focus:outline-none cursor-pointer">
                        {text}
                    </button>
                </TapTooltip>
            );
        }

        return <div className="w-full overflow-hidden text-right">{value}</div>;
    };

    return (
        <TooltipProvider>
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-xl mb-4 overflow-hidden text-sm flex flex-col w-full max-w-full box-border relative">
                
                {/* Header Grid */}
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center p-3 sm:p-4 border-b border-gray-100 dark:border-zinc-800/60 w-full gap-2 sm:gap-3 overflow-hidden">
                    
                    {checkbox ? (
                        <div className="flex items-center justify-center pr-1">{checkbox}</div>
                    ) : (
                        <div />
                    )}

                    {title ? (
                        <div className="w-full min-w-0 overflow-hidden">
                            <TapTooltip content={title}>
                                <button type="button" className="block w-full min-w-0 focus:outline-none cursor-pointer text-left">
                                    {renderTitleText()}
                                </button>
                            </TapTooltip>
                        </div>
                    ) : (
                        <div />
                    )}

                    {actions ? (
                        <div className="flex items-center text-gray-400 dark:text-zinc-500">
                            {actions}
                        </div>
                    ) : (
                        <div />
                    )}
                </div>

                <div className="p-3 sm:p-4 flex flex-col w-full overflow-hidden">
                    {/* Main Properties */}
                    <div className="flex flex-col gap-3 w-full">
                        {mainProps.map((prop, index) => (
                            <div key={`main-${index}`} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:gap-4 w-full overflow-hidden">
                                <span className="text-gray-500 dark:text-zinc-400 mt-0.5 whitespace-nowrap pr-2">
                                    {prop.label}
                                </span>
                                <div className="w-full min-w-0 font-medium text-gray-900 dark:text-gray-100 overflow-hidden">
                                    {renderValue(prop.value)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Expandable Minor Properties */}
                    {!fakeViewMore && minorProps.length > 0 && (
                        <div
                            className={`grid transition-all duration-300 ease-in-out w-full overflow-hidden ${
                                isExpanded
                                    ? "grid-rows-[1fr] opacity-100 mt-3"
                                    : "grid-rows-[0fr] opacity-0 mt-0"
                            }`}
                        >
                            <div className="overflow-hidden w-full">
                                <div className="flex flex-col gap-3 w-full pt-1">
                                    {minorProps.map((prop, index) => (
                                        <div key={`minor-${index}`} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:gap-4 w-full overflow-hidden">
                                            <span className="text-gray-500 dark:text-zinc-400 mt-0.5 whitespace-nowrap pr-2">
                                                {prop.label}
                                            </span>
                                            <div className="w-full min-w-0 font-medium text-gray-900 dark:text-gray-100 overflow-hidden">
                                                {renderValue(prop.value)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {fakeViewMore ? (
                    <div className="mt-auto w-full overflow-hidden">
                        {fakeViewMore}
                    </div>
                ) : (
                    (minorProps.length > 0 || onViewMore || onViewLess) && (
                        <div className="border-t border-gray-100 dark:border-zinc-800/60 w-full overflow-hidden">
                            <button
                                type="button"
                                onClick={handleToggleExpand}
                                className="w-full text-center text-blue-500 dark:text-blue-400 font-medium py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none"
                            >
                                {isExpanded ? viewLessText : viewMoreText}
                            </button>
                        </div>
                    )
                )}
            </div>
        </TooltipProvider>
    );
}