import React, { ComponentPropsWithoutRef, FC } from 'react';
import { cn } from '@/lib/utils';
import { CustomForm } from '@/components/ui/customForm';
import { FormFieldConfig } from '@/components/ui/customForm/customForm';

interface IProps extends ComponentPropsWithoutRef<'form'> {
    fromFields: FormFieldConfig[];
    onHandleSubmit: (val: Record<string, unknown>) => void;
}
const AddOptions: FC<IProps> = ({ fromFields, className, onHandleSubmit }) => {
    return (
        <CustomForm
            fromClassName={cn(
                'sm:flex-row max-sm:mx-auto max-sm:max-w-xs mb-0 flex-wrap',
                className,
            )}
            fields={fromFields ?? []}
            onSubmit={onHandleSubmit}
            isInlineButton
            buttonClassName='sm:max-w-20 rounded-sm dark:text-gray-100'
            buttonLabel='Add'
        />
    );
};

export default AddOptions;
