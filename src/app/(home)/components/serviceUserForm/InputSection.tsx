import { Label } from '@radix-ui/react-label';
import { FC, InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';

interface IProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    value: string;
    onChange: (value: string) => void;
}
const InputSection: FC<IProps> = ({ label, value, onChange, ...rest }) => (
    <div className='grid grid-cols-3 items-center gap-4'>
        <Label htmlFor={label} className='col-span-1 font-semibold text-base md:text-lg uppercase'>
            {label}
        </Label>
        <Input
            {...rest}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            id={label}
            className='col-span-2 text-white text-base placeholder:text-gray-400'
        />
    </div>
);
export default InputSection;
