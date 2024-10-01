import Link from 'next/link';
import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { CustomDialogModal } from '@/components/ui/customDialogModal';
import { ServiceUserForm } from '../serviceUserForm';
import { TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceResponse } from '@/types/service';
import { THandleAddServiceUser } from '../serviceUserTable/ServiceUser';
import { TServiceUserPayload } from '@/types/serviceUser';

interface IProps {
    handleAddUser: THandleAddServiceUser;
    servicesAccounts:TServiceAccountResponse[]
    services:TServiceResponse[]
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ButtonContainer: FC<IProps> = ({ handleAddUser,services,servicesAccounts,isOpen, setIsOpen }) => {
    return (
        <div className='flex justify-between'>
            <div className='flex gap-3 md:gap-6'>
                <Button
                    asChild
                    className='rounded-[5px] dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'
                >
                    <Link href='/dashboard/task' className=''>
                        task
                    </Link>
                </Button>
                <Button
                    asChild
                    className='rounded-[5px] dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'
                >
                    <Link href='/dashboard' className=''>
                        all accounts
                    </Link>
                </Button>
            </div>

            <div className='flex gap-3 md:gap-6'>
                <Button
                    asChild
                    className='rounded-[5px] dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'
                >
                    <Link href='/dashboard/history' className=''>
                        Data
                    </Link>
                </Button>
                 <Button onClick={()=>setIsOpen(true)} className='rounded  w-full max-w-md dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'>
                            add
                        </Button>
                <CustomDialogModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isHideButtonTrigger
                    title='add user'
                    modalContentProps={
                        <ServiceUserForm onSubmit={(newUserData: TServiceUserPayload) => handleAddUser(newUserData)} services={services} servicesAccounts={servicesAccounts} />
                    }
                />
            </div>
        </div>
    );
};

export default ButtonContainer;
