import React, { useState } from "react";

export default function MobileDataCard({
    title,
    checkbox,
    actions,
    mainProps = [],
    minorProps = [],
    fakeViewMore,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-xl mb-4 overflow-hidden text-sm flex flex-col w-full box-border">
            {/* Header: Title, Checkbox, Actions */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800/60">
                <div className="flex items-center gap-3 overflow-hidden">
                    {checkbox && <div className="flex-shrink-0">{checkbox}</div>}
                    {title && <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</span>}
                </div>
                {actions && (
                    <div className="flex items-center gap-4 text-gray-400 dark:text-zinc-500 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>

            {/* Body Properties */}
            <div className="p-4 flex flex-col gap-3">
                {mainProps.map((prop, index) => (
                    <div key={`main-${index}`} className="flex justify-between items-center gap-4">
                        <span className="text-gray-500 dark:text-zinc-400 whitespace-nowrap">{prop.label}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-right truncate">{prop.value}</span>
                    </div>
                ))}

                {isExpanded && !fakeViewMore && minorProps.map((prop, index) => (
                    <div key={`minor-${index}`} className="flex justify-between items-center gap-4">
                        <span className="text-gray-500 dark:text-zinc-400 whitespace-nowrap">{prop.label}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-right truncate">{prop.value}</span>
                    </div>
                ))}
            </div>

            {/* Footer View More or Fake View More */}
            {fakeViewMore ? (
                <div className="mt-auto">
                    {fakeViewMore}
                </div>
            ) : (
                minorProps.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-zinc-800/60">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full text-center text-blue-500 dark:text-blue-400 font-medium py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                            {isExpanded ? "View Less" : "View More"}
                        </button>
                    </div>
                )
            )}
        </div>
    );
}