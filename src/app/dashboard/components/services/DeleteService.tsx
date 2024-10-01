import { useQueryClient } from '@tanstack/react-query';
import React, { FC } from 'react';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';
import { deleteServiceAction } from '@/app/actions/service';
import useShowToast from '@/app/hooks/useShowToast';

interface IProps {
    id: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeleteService:FC<IProps> = ({ id, isOpen, setIsOpen }) => {
    const { showToast } = useShowToast();
    const queryClient = useQueryClient();
    const handleDeleteService = async () => {
        const { data, error } = await deleteServiceAction(id);
        if (error) return showToast(false, error);
        const message = (data as { message: string }).message;
        showToast(true, message);
        queryClient.invalidateQueries({ queryKey: ['services'] });
    };

    return (
        <CustomAlertDialog
            buttonTitle='Delete'
            message='Are you sure you want to delete this service?'
            messageTitle='Delete Service'
            isDisabledTriggerBtn
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClick={handleDeleteService}
        />
    );
};

export default DeleteService;
