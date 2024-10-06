import { getPendingTaskCount } from '@/http';
import { PENDING_TASK_COUNT } from '@/statics/queryKey';
import Link from 'next/link';
import React, { FC } from 'react';
import { TServiceResponse } from '@/types/service';
import { TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceUserPayload } from '@/types/serviceUser';
import { useFetchData } from '@/lib/useFetchData';
import { Button } from '@/components/ui/button';
import { CustomDialogModal } from '@/components/ui/customDialogModal';
import { useIsAdmin } from '@/app/hooks';
import { ServiceUserForm } from '../serviceUserForm';
import { THandleAddServiceUser } from '../serviceUserTable/ServiceUser';

interface IProps {
    handleAddUser: THandleAddServiceUser;
    servicesAccounts: TServiceAccountResponse[];
    services: TServiceResponse[];
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonContainer: FC<IProps> = ({
    handleAddUser,
    services,
    servicesAccounts,
    isOpen,
    setIsOpen,
}) => {
    const { data: res } = useFetchData([PENDING_TASK_COUNT], getPendingTaskCount);
    const pendingTasks = (res as { data: number })?.data;
    const isAdmin = useIsAdmin();
    return (
        <div className='flex justify-between max-xxs:flex-wrap pt-3 gap-4'>
            <div className='flex gap-3 max-xxs:justify-between max-xxs:w-full md:gap-6'>
                <Button
                    asChild
                    className='rounded-[5px] dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'
                >
                    <Link href='/dashboard/task' className='relative'>
                        task
                        <span className='inline-flex items-center justify-center size-6 rounded-full text-white bg-primary absolute -top-3 -right-2'>
                            {pendingTasks ?? 0}
                        </span>
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

            <div className='flex gap-3 max-xxs:justify-between max-xxs:w-full md:gap-6'>
                {isAdmin && (
                    <Button
                        asChild
                        className='rounded-[5px] dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'
                    >
                        <Link href='/dashboard/history' className=''>
                            Data
                        </Link>
                    </Button>
                )}
                <Button
                    onClick={() => setIsOpen(true)}
                    className='rounded  w-full max-w-[124px] xxs:max-w-md dark:bg-cream text-sm md:text-base uppercase font-semibold px-3 md:px-6 py-1.5 h-auto shadow-none'
                >
                    add
                </Button>
                <CustomDialogModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isHideButtonTrigger
                    title='add user'
                    modalContentProps={
                        <ServiceUserForm
                            onSubmit={(newUserData: TServiceUserPayload) =>
                                handleAddUser(newUserData)
                            }
                            services={services}
                            servicesAccounts={servicesAccounts}
                        />
                    }
                />
            </div>
        </div>
    );
};

export default ButtonContainer;
