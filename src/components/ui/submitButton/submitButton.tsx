import React, { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

interface IProps extends ButtonProps {
    buttonTitle?: ReactNode | string;
    isSubmitting?: boolean;
}
const SubmitButton: FC<IProps> = ({ className, buttonTitle, isSubmitting, ...rest }) => {
    return (
        <Button
            {...rest}
            type='button'
            className={cn(
                'bg-red-700 hover:bg-red-800 px-5 h-auto !leading-none font-bold text-white text-base md:text-lg uppercase',
                className,
            )}
        >
            {isSubmitting ? (
                <span className='inline-flex items-center gap-2'>
                    {buttonTitle}ing... <Icons.Loader className='animate-spin' />
                </span>
            ) : (
                (buttonTitle ?? 'Are you sure you want to delete this?')
            )}
        </Button>
    );
};

export default SubmitButton;
