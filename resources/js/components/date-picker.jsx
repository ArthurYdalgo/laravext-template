import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";

export default ({date, label = 'Data', innerDivClassName='gap-3', labelClassName = '', buttonClassName = '', onChangeDate = () => {}, onClear = () => {}}) => {
    const [open, setOpen] = useState(false);

    const [month, setMonth] = useState(date);

    return (
        <div className="flex gap-4">
            <div className={"flex flex-col " + innerDivClassName}>
                {label && <Label htmlFor="date-picker" className={labelClassName}>
                    {label}
                </Label>}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className={"w-auto justify-between font-normal py-[18px] " + buttonClassName}
                        >
                            {date ? date.toLocaleDateString('pt-BR') :  "Selecione"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0 z-[99]"
                        align="start"
                    >
                        <Calendar
                            classNames="z-[999999]"
                            mode="single"
                            selected={date}
                            month={month}
                            onMonthChange={setMonth}
                            captionLayout="dropdown"
                            onSelect={(newDate) => {
                                setOpen(false);
                                onChangeDate(newDate);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex gap-3 items-center">
                 {label && <Label htmlFor="date-picker" className="px-1 opacity-0">
                    .
                </Label>}
                <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={onClear}
                    className="p-2 mt-0.5 rounded bg-red-500 text-white hover:bg-red-600"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>

                </div>
            </div>
        </div>
    );
};
