'use client';

import { QueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { produce } from 'immer'; // for easier state updates, install it via `npm install immer`
import React, { useCallback, useMemo } from 'react';
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { TServiceResponse } from '@/types/service';
import { TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceUserPayload, TServiceUserResponse } from '@/types/serviceUser';
import { TUserRespone } from '@/types/user';
import { Button } from '@/components/ui/button';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';
import { CustomDialogModal } from '@/components/ui/customDialogModal';
import { DatePicker } from '@/components/ui/datePicker';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { deleteServiceUserAction, updateServiceUserAction } from '@/app/actions/serviceUser';
import useShowToast from '@/app/hooks/useShowToast';
import { ServiceUserForm } from '../serviceUserForm';

export interface IServiceUserTableColumns {
    data: TServiceUserResponse[];
    providers: TUserRespone[];
    services: TServiceResponse[];
    serviceAccounts: TServiceAccountResponse[];
    joinSelectedDate: Date | undefined;
    endSelectedDate: Date | undefined;
    selectedProvider: string | undefined;
    queryClient: QueryClient;
    setSelectedProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
    onDateChange: (dateType: 'joinDate' | 'endDate', date: Date | undefined) => void;
}

const ServiceUserTableColumns = ({
    serviceAccounts,
    services,
    providers,
    joinSelectedDate,
    endSelectedDate,
    selectedProvider,
    setSelectedProvider,
    onDateChange,
    queryClient,
}: IServiceUserTableColumns) => {
    const { showToast } = useShowToast();

    const handleProviderChange = useCallback(
        (provider: string | undefined) => {
            setSelectedProvider(provider);
        },
        [setSelectedProvider],
    );

    const handleDelete = useCallback(
        async (id: string) => {
            // Optimistically remove the deleted user from the cache
            queryClient.setQueryData<TServiceUserResponse[]>(
                ['serviceUsers'],
                (oldData) => oldData?.filter((user) => user.id !== id) || [],
            );

            const { data, error } = await deleteServiceUserAction(id);

            if (error) {
                // Roll back changes if there was an error
                queryClient.invalidateQueries({ queryKey: ['serviceUsers'] });
                return showToast(false, error);
            }

            const message = (data as { message: string }).message;
            showToast(true, message);

            // Ensure data stays up-to-date
            queryClient.invalidateQueries({ queryKey: ['serviceUsers'] });
        },
        [showToast, queryClient],
    );

    const handleEditUser = useCallback(
        async (id: string, payload: TServiceUserPayload) => {
            // Optimistically update the user in the cache
            queryClient.setQueryData<TServiceUserResponse[]>(
                ['serviceUsers'],
                (oldData) =>
                    produce(oldData, (draft) => {
                        const index = draft?.findIndex((user) => user.id === id);
                        if (index !== undefined && index !== -1) {
                            draft![index] = { ...draft![index], ...payload };
                        }
                    }) || [],
            );

            const { data, error } = await updateServiceUserAction(id, payload);

            if (error) {
                // Roll back changes if there was an error
                queryClient.invalidateQueries({ queryKey: ['serviceUsers'] });
                return showToast(false, error);
            }

            const message = (data as { message: string }).message;
            showToast(true, message);

            // Ensure data stays up-to-date
            queryClient.invalidateQueries({ queryKey: ['serviceUsers'] });
        },
        [showToast, queryClient],
    );

    const columns: ColumnDef<TServiceUserResponse>[] = useMemo(
        () => [
            {
                accessorKey: 'sl',
                header: ({ column }) => (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='flex items-center'
                    >
                        Sl No <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => `#${row.index + 1}`,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => row.getValue('name'),
            },
            {
                accessorKey: 'phone',
                header: 'phone',
                cell: ({ row }) => row.getValue('phone'),
            },
            {
                accessorKey: 'email',
                header: 'email',
                cell: ({ row }) => {
                    const email = row.getValue('email');
                    return email || '--  --';
                },
            },
            {
                accessorKey: 'model',
                header: 'model',
                cell: ({ row }) => {
                    const model = row.getValue('model');
                    return model || '--  --';
                },
            },
            {
                accessorKey: 'services',
                header: 'services',
                cell: ({ row }) => row.original.service.name,
            },
            {
                accessorKey: 'joinDate',
                header: () => (
                    <DatePicker
                        selectedDate={joinSelectedDate}
                        onSelectDate={(date) => onDateChange('joinDate', date)}
                        label='Join Date'
                    />
                ),
                cell: ({ row }) => {
                    const joinDate = row.getValue('joinDate');
                    return format(joinDate as Date, 'dd MMM yyyy');
                },
            },
            {
                accessorKey: 'endDate',
                header: () => (
                    <DatePicker
                        selectedDate={endSelectedDate}
                        onSelectDate={(date) => onDateChange('endDate', date)}
                        label='End Date'
                    />
                ),
                cell: ({ row }) => {
                    const endDate = row.getValue('endDate');
                    return format(endDate as Date, 'dd MMM yyyy');
                },
            },
            {
                accessorKey: 'leftDays',
                header: ({ column }) => (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='flex items-center'
                    >
                        Left Days <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => row.getValue('leftDays'),
            },
            {
                accessorKey: 'status',
                header: ({ column }) => (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='flex items-center'
                    >
                        Status <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => row.getValue('status'),
            },
            {
                accessorKey: 'provider',
                header: ({ column }) => {
                    const uniqueProviders = Array.from(
                        new Map(providers.map((item) => [item.userName, item])).values(),
                    );
                    const providerOptions = uniqueProviders.map(({ userName, id }) => ({
                        id,
                        name: userName ?? '',
                    }));
                    return (
                        <SelelectAndSearch
                            placeholder='Provider'
                            options={providerOptions}
                            value={selectedProvider ?? ''}
                            onChange={(value) => {
                                handleProviderChange(value);
                                column.setFilterValue(value);
                            }}
                        />
                    );
                },
                cell: ({ row }) => {
                    return <p className='capitalize font-medium'>{row.original.providerName}</p>;
                },
            },
            {
                id: 'action',
                header: '',
                cell: ({ row }) => {
                    const rowId = row.original.id;
                    return (
                        <CustomDialogModal
                            buttonTitle={
                                <button className='cursor-pointer text-xl'>
                                    <FaEdit />
                                </button>
                            }
                            title='edit user'
                            modalContentProps={
                                <ServiceUserForm
                                    rowData={row.original}
                                    onSubmit={(payload) => handleEditUser(rowId, payload)}
                                    services={services}
                                    servicesAccounts={serviceAccounts}
                                />
                            }
                        />
                    );
                },
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => {
                    const serviceUserId = row.original.id;
                    return (
                        <CustomAlertDialog
                            className='bg-transparent hover:bg-transparent text-black dark:text-white text-xl p-0 h-fit shadow-none'
                            buttonTitle={<FaWindowClose />}
                            messageTitle='Are you absolutely sure?'
                            message='This action cannot be undone. This will permanently delete data from our servers.'
                            onClick={() => handleDelete(serviceUserId)}
                        />
                    );
                },
            },
        ],
        [
            joinSelectedDate,
            onDateChange,
            endSelectedDate,
            providers,
            selectedProvider,
            handleProviderChange,
            services,
            serviceAccounts,
            handleEditUser,
            handleDelete,
        ],
    );

    return columns;
};

export default ServiceUserTableColumns;
