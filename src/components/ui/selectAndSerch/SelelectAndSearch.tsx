'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '../icons';

type Option = {
    id: string;
    name?: string;
    email?: string;
};

interface ISelelectAndSearchProps {
    options: Option[];
    value: string;
    placeholder: string;
    onChange: (selected: string) => void;
    className?: string;
    dropSelect?: boolean;
    iconStyle?: string;
    variant?: ButtonProps['variant'];
    isLoading?: boolean;
}

const SelelectAndSearch: React.FC<ISelelectAndSearchProps> = ({
    options,
    value,
    placeholder,
    onChange,
    className,
    dropSelect,
    iconStyle,
    variant,
    isLoading,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={variant ?? 'ghost'}
                    role='combobox'
                    aria-expanded={open}
                    className={cn('justify-between gap-2 px-2 capitalize', className)}
                >
                    {value || placeholder}
                    {dropSelect ? (
                        <IoIosArrowForward className='rotate-90' />
                    ) : (
                        <ChevronsUpDown className={`h-4 w-4 shrink-0 ${iconStyle}`} />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder={`Search ${placeholder}...`} />
                    <CommandList>
                        <CommandEmpty>No {placeholder} found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                key='all'
                                value=''
                                onSelect={() => {
                                    onChange('');
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={`mr-2 h-4 w-4 ${value === '' ? 'opacity-100' : 'opacity-0'}`}
                                />
                                All
                            </CommandItem>
                            {isLoading ? (
                                <CommandItem className='gap-2 justify-center'>
                                    <Icons.Loader className='animate-spin h-4 w-4' />
                                    Loading...
                                </CommandItem>
                            ) : (
                                options.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        value={option.name ?? option.email}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? '' : currentValue);
                                            setOpen(false);
                                        }}
                                        className='capitalize'
                                    >
                                        <Check
                                            className={`mr-2 h-4 w-4 ${value === option.name ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                        {option.name} {option.email}
                                    </CommandItem>
                                ))
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SelelectAndSearch;
