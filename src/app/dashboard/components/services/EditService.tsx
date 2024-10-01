import { useQueryClient } from '@tanstack/react-query';
import React, { FC } from 'react';
import { z } from 'zod';
import { TServiceResponse } from '@/types/service';
import CustomForm, { FormFieldConfig } from '@/components/ui/customForm/customForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { updateServiceAction } from '@/app/actions/service';
import useShowToast from '@/app/hooks/useShowToast';

interface IProps extends TServiceResponse {
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditService: FC<IProps> = ({ name, id, isOpen, setIsOpen }) => {
    const { showToast } = useShowToast();
    const queryClient = useQueryClient();
    const EditServiceFromField: FormFieldConfig[] = [
        {
            name: 'name',
            type: 'text',
            validation: z
                .string()
                .min(1, { message: 'Please enter your service name' })
                .max(100, { message: 'service name should be less than 100 characters' }),
            placeholder: 'Enter service name',
            className: 'w-full',
            value: name,
        },
    ];
    const handleEditService = async (val: Record<string, unknown>) => {
        const { data, error } = await updateServiceAction(id, { name: val.name as string, id });
        if (error) {
            showToast(false, error);
            setIsOpen?.(false);
            return;
        }
        const message = (data as { message: string }).message;
        showToast(true, message);
        queryClient.invalidateQueries({ queryKey: ['services'] });
        setIsOpen?.(false);
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogDescription className='sr-only'>this is a Edit service dialog</DialogDescription>
            <DialogContent className='w-11/12  md:max-w-[585px] dark:bg-card pb-2'>
                <DialogTitle className='text-2xl text-center font-bold uppercase'>
                    Edit Service
                </DialogTitle>
                <CustomForm
                    fromClassName='mb-5'
                    buttonClassName='text-gray-50'
                    onSubmit={handleEditService}
                    fields={EditServiceFromField}
                    isInlineButton
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditService;
