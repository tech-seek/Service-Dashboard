import { DatePicker } from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import { FC } from "react";

const DatePickerSection: FC<{
    label: string;
    selectedDate: Date | undefined;
    onSelectDate: (date: Date | undefined) => void;
}> = ({ label, selectedDate, onSelectDate }) => (
    <div className='grid grid-cols-3 items-center gap-4'>
        <Label className='col-span-1 font-semibold text-base md:text-lg uppercase'>{label}</Label>
        <DatePicker
            labelClass='dark:hover:bg-[#ffffff62] px-2 text-white w-auto font-semibold text-lg capitalize'
            iconClass='text-white size-5 md:size-6'
            label={label}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
        />
    </div>
);
export default DatePickerSection;