import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MobileDataCard({
    title,
    checkbox,
    actions,
    mainProps = [],
    minorProps = [],
    fakeViewMore,
    viewMoreText = "View More",
    viewLessText = "View Less",
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const renderValue = (value) => {
        if (value === null || value === undefined) return null;

        if (typeof value === "string" || typeof value === "number") {
            const text = String(value);
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="block max-w-full truncate text-right">
                            {text}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">{text}</TooltipContent>
                </Tooltip>
            );
        }

        return <div className="max-w-full overflow-hidden">{value}</div>;
    };

    return (
        <TooltipProvider>
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-xl mb-4 overflow-hidden overflow-x-hidden text-sm flex flex-col w-full min-w-0 max-w-full box-border relative">
                {/* Header: Title, Checkbox, Actions */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-zinc-800/60 w-full min-w-0 gap-2 sm:gap-4 overflow-hidden overflow-x-hidden">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 flex-1">
                        {checkbox && <div className="flex-shrink-0">{checkbox}</div>}
                        {title && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 truncate block w-full min-w-0">
                                        {title}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="top">{title}</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center text-gray-400 dark:text-zinc-500 flex-shrink-0">
                            {actions}
                        </div>
                    )}
                </div>

                <div className="p-3 sm:p-4 flex flex-col w-full min-w-0 overflow-hidden overflow-x-hidden">
                    {/* Main Properties (Always Visible) */}
                    <div className="flex flex-col gap-3 w-full min-w-0">
                        {mainProps.map((prop, index) => (
                            <div key={`main-${index}`} className="flex justify-between items-start gap-3 sm:gap-4 w-full min-w-0 overflow-hidden">
                                {/* Label: Never shrinks, sits at the top */}
                                <span className="text-gray-500 dark:text-zinc-400 flex-shrink-0 mt-0.5 max-w-[45%] truncate">
                                    {prop.label}
                                </span>
                                {/* Ghost Wrapper: Absorbs space safely and aligns right */}
                                <div className="flex-1 min-w-0 flex justify-end overflow-hidden">
                                    <div className="font-medium text-gray-900 dark:text-gray-100 max-w-full overflow-hidden">
                                        {renderValue(prop.value)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Animated Expandable Minor Properties */}
                    {!fakeViewMore && minorProps.length > 0 && (
                        <div
                            className={`grid transition-all duration-300 ease-in-out w-full ${
                                isExpanded
                                    ? "grid-rows-[1fr] opacity-100 mt-3"
                                    : "grid-rows-[0fr] opacity-0 mt-0"
                            }`}
                        >
                            <div className="overflow-hidden w-full">
                                <div className="flex flex-col gap-3 w-full min-w-0 pt-1">
                                    {minorProps.map((prop, index) => (
                                        <div key={`minor-${index}`} className="flex justify-between items-start gap-3 sm:gap-4 w-full min-w-0 overflow-hidden">
                                            <span className="text-gray-500 dark:text-zinc-400 flex-shrink-0 mt-0.5 max-w-[45%] truncate">
                                                {prop.label}
                                            </span>
                                            <div className="flex-1 min-w-0 flex justify-end overflow-hidden">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 max-w-full overflow-hidden">
                                                    {renderValue(prop.value)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer View More or Fake View More */}
                {fakeViewMore ? (
                    <div className="mt-auto w-full min-w-0 overflow-hidden">
                        {fakeViewMore}
                    </div>
                ) : (
                    minorProps.length > 0 && (
                        <div className="border-t border-gray-100 dark:border-zinc-800/60 w-full min-w-0 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
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