import React, { FC, ReactNode } from 'react';
import { Dialog, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ModalContent } from '../modalContent';

interface IProps {
    title: string;
    modalContentProps?: ReactNode;
    buttonTitle?: ReactNode;
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    isHideButtonTrigger?: boolean;
}

const CustomDialogModal: FC<IProps> = ({
    buttonTitle,
    title,
    modalContentProps,
    isOpen,
    setIsOpen,
    isHideButtonTrigger,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!isHideButtonTrigger && <DialogTrigger asChild>{buttonTitle}</DialogTrigger>}
            <DialogTitle className='sr-only'>this is a reuseable dialog</DialogTitle>
            <DialogDescription className='sr-only'>this is a reuseable dialog</DialogDescription>
            <ModalContent title={title} modalContentProps={modalContentProps} />
        </Dialog>
    );
};

export default CustomDialogModal;
