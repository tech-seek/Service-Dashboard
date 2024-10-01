'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface IProps {
    label?: string;
    selectedDate?: Date;
    onSelectDate?: (date: Date | undefined) => void;
    iconClass?: string;
    labelClass?: string;
    disable?: boolean;
}

export default function DatePicker({
    label,
    onSelectDate,
    selectedDate,
    iconClass,
    labelClass,
    disable,
}: Readonly<IProps>) {
    const handleDateChange = (date: Date | undefined) => {
        onSelectDate?.(date);
    };

    const formattedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';

    return (
        <div className='space-y-8'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            `md:max-w-52 w-full inline-flex items-center gap-2 pl-3 text-left font-normal border-0  bg-transparent group`,
                            labelClass,
                            !selectedDate && 'text-muted-foreground ',
                        )}
                    >
                        {formattedDate || (
                            <span className='text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-50 dark:text-gray-300 font-bold capitalize'>
                                {label}
                            </span>
                        )}
                        <CalendarIcon
                            className={`size-4 text-gray-50 group-hover:text-gray-900 dark:group-hover:text-gray-50 ${iconClass}`}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        mode='single'
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                        defaultMonth={selectedDate}
                        disabled={disable}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
