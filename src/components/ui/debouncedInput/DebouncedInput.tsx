import { FC, InputHTMLAttributes, useEffect, useState } from 'react';
import { Input } from '../input';

interface IDebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}
const DebouncedInput: FC<IDebouncedInputProps> = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = useState<string | number>(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <Input
            {...props}
            value={value ?? ''}
            onChange={(e) => {
                if (e.target.value === '') return setValue('');
                if (props.type === 'number') {
                    setValue(e.target.valueAsNumber);
                } else {
                    setValue(e.target.value);
                }
            }}
        />
    );
};
export default DebouncedInput;
