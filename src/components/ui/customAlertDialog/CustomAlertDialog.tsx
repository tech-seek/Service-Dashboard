import React, { FC, ReactNode } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import SubmitButton from '../submitButton/submitButton';

interface IProps {
    className?: string;
    buttonTitle?: string | ReactNode;
    messageTitle?: string;
    message?: string;
    onClick: () => void;
    isSubmitting?: boolean;
    isDisabledTriggerBtn?: boolean;
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomAlertDialog: FC<IProps> = ({
    className,
    buttonTitle,
    messageTitle,
    message,
    onClick,
    isSubmitting,
    isOpen,
    setIsOpen,
    isDisabledTriggerBtn,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {!isDisabledTriggerBtn && (
                <AlertDialogTrigger asChild>
                    <SubmitButton
                        className={className}
                        buttonTitle={buttonTitle}
                        isSubmitting={isSubmitting}
                    />
                </AlertDialogTrigger>
            )}

            <AlertDialogContent className='w-11/12'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{messageTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlertDialog;
