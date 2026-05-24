import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";

export default function DateTimePicker ({
    date,
    time,
    dateLabel = "Data",
    timeLabel = "Hora",
    showLabelOnTopOfTrashButton = true,
    onChangeDate = () => {},
    onChangeTime = () => {},
    onClear = () => {},
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                {dateLabel && (
                    <Label htmlFor="date-picker" className="px-1">
                        {dateLabel}
                    </Label>
                )}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal py-[18px] border-gray-300"
                        >
                            {date
                                ? date.toLocaleDateString("pt-BR")
                                : "Selecione"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(newDate) => {
                                // setDate(newDate);
                                setOpen(false);

                                onChangeDate(newDate);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                {timeLabel && (
                    <Label htmlFor="date-picker" className="px-1">
                        {timeLabel}
                    </Label>
                )}
                <Input
                    type="time"
                    step="60" // Updated step to remove seconds
                    id="time-picker"
                    required={date}
                    onChange={(e) => {
                        const timeValue = e.target.value;
                        const [hours, minutes] = timeValue.split(":");
                        const dateObject = new Date();
                        dateObject.setHours(hours);
                        dateObject.setMinutes(minutes);
                        // setTime(dateObject);
                        onChangeTime(dateObject);
                    }}
                    value={time ? time.toTimeString().slice(0, 5) : ""}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
            <div className="flex flex-col gap-3">
                {showLabelOnTopOfTrashButton && (
                    <Label htmlFor="date-picker" className="px-1 opacity-0">
                        .
                    </Label>
                )}
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
