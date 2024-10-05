import { useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { z } from 'zod';
import { TServicePayload } from '@/types/service';
import { CustomForm } from '@/components/ui/customForm';
import { FormFieldConfig } from '@/components/ui/customForm/customForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { createServiceAction } from '@/app/actions/service';
import useShowToast from '@/app/hooks/useShowToast';

interface IProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const addServiceFromField: FormFieldConfig[] = [
    {
        name: 'name',
        type: 'text',
        validation: z
            .string()
            .min(1, { message: 'Please enter your service name' })
            .max(100, { message: 'service name should be less than 100 characters' }),
        placeholder: 'Enter service name',
        className: 'w-full',
    },
];
const AddServiceBtn: FC<IProps> = ({ isOpen, setIsOpen }) => {
    const queryClient = useQueryClient();
    const { showToast } = useShowToast();
    const handleAddService = async (val: Record<string, unknown>) => {
        setIsOpen(false);
        const prevService = queryClient.getQueryData(['services']);
        const { data, error } = await createServiceAction(val as TServicePayload);
        if (error) {
            queryClient.setQueryData(['services'], prevService);
            return showToast(false, error);
        }
        queryClient.setQueryData(['services'], (old: TServicePayload[]) => [...old, data]);
        const message = (data as { message: string }).message;
        showToast(true, message);
        queryClient.invalidateQueries({ queryKey: ['services'] });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogDescription className='sr-only'>this is a add service dialog</DialogDescription>
            <DialogContent className='w-11/12  md:max-w-[585px] dark:bg-card pb-2'>
                <DialogTitle className='text-2xl text-center font-bold uppercase'>
                    Add Service
                </DialogTitle>
                <CustomForm
                    fromClassName='mb-5'
                    buttonClassName='text-gray-50'
                    onSubmit={handleAddService}
                    fields={addServiceFromField}
                    isInlineButton
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddServiceBtn;
