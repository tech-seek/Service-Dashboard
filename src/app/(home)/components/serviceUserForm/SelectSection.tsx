import { FC } from 'react';
import { Label } from '@/components/ui/label';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';

const SelectSection: FC<{
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { id: string; name: string }[];
}> = ({ label, value, onValueChange, options }) => (
    <div className='grid grid-cols-3 items-center gap-4'>
        <Label className='col-span-1 font-semibold text-base md:text-lg uppercase'>{label}</Label>
        <SelelectAndSearch
            placeholder='Select an option'
            className='w-fit'
            options={options}
            value={value}
            onChange={onValueChange}
            dropSelect
        />
    </div>
);
export default SelectSection;
