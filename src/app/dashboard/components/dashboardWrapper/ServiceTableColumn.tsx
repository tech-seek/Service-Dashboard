'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import { TDealerResponse } from '@/types/dealer';
import { TServiceResponse } from '@/types/service';
import { TServiceAccountPayload, TServiceAccountResponse } from '@/types/serviceAccount';
import { Button } from '@/components/ui/button';
import { CustomDialogModal } from '@/components/ui/customDialogModal';
import { DatePicker } from '@/components/ui/datePicker';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { createServiceAccuntAction, deleteServiceAccuntAction, updateServiceAccuntAction } from '@/app/actions/serviceAccount';
import useShowToast from '@/app/hooks/useShowToast';
import { AddAccDataModalCon, EditAccDataModalCon } from '..';
import { SERVICE_ACCOUNTS } from '@/statics/queryKey';


interface IProps {
    data: TServiceResponse;
    joinSelectedDate: Date | undefined;
    endSelectedDate: Date | undefined;
    dealers: TDealerResponse[];
    showServiceName?: boolean;
    selectedDealer: {
        [key: string]: string | null;
    };
    onDealerChange: (serviceId: string, dealer: string | null) => void;
    onDateChange: (
        serviceId: string,
        dateType: 'joinDate' | 'endDate',
        date: Date | undefined,
    ) => void;
}
const ServiceTableColumn = ({
    data,
    dealers,
    joinSelectedDate,
    endSelectedDate,
    selectedDealer,
    onDealerChange,
    onDateChange,
    showServiceName,
}: IProps) => {
    // The hook that shows a toast message. We use it to show
    // success or error messages when the user adds, edits, or
    // deletes an account.
    const { showToast } = useShowToast();

    // The client from react-query that we use to invalidate
    // the cache when the user adds, edits, or deletes an account.
    const queryClient = useQueryClient();

    // A callback function that adds a new service account.
    // It takes the new user data as an argument and returns
    // nothing. It uses the createServiceAccuntAction function
    // to add the new account, and if there is an error, it
    // shows an error toast message. If the account is added
    // successfully, it shows a success toast message and
    // invalidates the cache.
    const handleAddServiceAccunt = useCallback(
        async (newUserData: TServiceAccountPayload) => {
            // Call the createServiceAccuntAction function to add the
            // new account.
            const prevServiceAcc = queryClient.getQueryData([SERVICE_ACCOUNTS]);
            const { data, error } = await createServiceAccuntAction(newUserData);

            // If there is an error, show an error toast message.
            if (error) {
                queryClient.setQueryData([SERVICE_ACCOUNTS], prevServiceAcc);
                return showToast(false, error);
            }
            const message = (data as { message: string }).message;
            showToast(true, message);
            queryClient.invalidateQueries({ queryKey: [SERVICE_ACCOUNTS] });
        },
        [showToast, queryClient],
    );

    // A callback function that edits an existing service account.
    // It takes the account ID and edited account data as arguments
    // and returns nothing. It uses the updateServiceAccuntAction
    // function to edit the account, and if there is an error, it
    // shows an error toast message. If the account is edited
    // successfully, it shows a success toast message and
    // invalidates the cache.
    const handleEditAccount = useCallback(
        async (accountId: string, editedAccountData: TServiceAccountPayload) => {
            // Call the updateServiceAccuntAction function to edit the
            // account.
            const prevServiceAcc = queryClient.getQueryData([SERVICE_ACCOUNTS]);

            const { data, error } = await updateServiceAccuntAction(accountId, editedAccountData);

            // If there is an error, show an error toast message.
            if (error) {
                queryClient.setQueryData([SERVICE_ACCOUNTS], prevServiceAcc);
                return showToast(false, error);
            }

            // If the account is edited successfully, show a success
            // toast message and invalidate the cache.
            const message = (data as { message: string }).message;
            showToast(true, message);
            queryClient.invalidateQueries({ queryKey: [SERVICE_ACCOUNTS] });
        },
        [showToast, queryClient],
    );

    // A callback function that deletes an existing service account.
    // It takes the account ID as an argument and returns nothing.
    // It uses the deleteServiceAccuntAction function to delete the
    // account, and if there is an error, it shows an error toast
    // message. If the account is deleted successfully, it shows a
    // success toast message and invalidates the cache.
    const handleDeleteAccount = useCallback(
        async (accountId: string) => {
            // Call the deleteServiceAccuntAction function to delete the
            // account.
            const prevServiceAcc = queryClient.getQueryData([SERVICE_ACCOUNTS]);
            const { data, error } = await deleteServiceAccuntAction(accountId);

            // If there is an error, show an error toast message.
            if (error) {
                queryClient.setQueryData([SERVICE_ACCOUNTS], prevServiceAcc);
                return showToast(false, error);
            }

            queryClient.setQueryData(
                [SERVICE_ACCOUNTS],
                [...(prevServiceAcc as TServiceAccountResponse[]), data],
            );
            // If the account is deleted successfully, show a success
            // toast message and invalidate the cache.
            const message = (data as { message: string }).message;
            showToast(true, message);
            queryClient.invalidateQueries({ queryKey: [SERVICE_ACCOUNTS] });
        },
        [showToast, queryClient],
    );

    //columns
    const columns: ColumnDef<TServiceAccountResponse>[] = useMemo(
        () => [
            {
                accessorKey: 'sl',
                header: ({ column }) => (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='flex items-center text-gray-200 dark:text-gray-300 font-bold capitalize'
                    >
                        Sl No <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => `#${row.index + 1}`,
            },

            {
                accessorKey: 'email',
                header: 'Name',
                cell: ({ row }) => row.getValue('email'),
            },
            {
                accessorKey: 'number',
                header: 'Phone',
                cell: ({ row }) => row.getValue('number') || '--  --',
            },
            {
                accessorKey: 'password',
                header: 'Password',
                cell: ({ row }) => row.getValue('password'),
            },
            ...(showServiceName
                ? [
                      {
                          accessorKey: 'serviceName',
                          header: 'Service Name',
                          cell: ({ row }: { row: Row<TServiceAccountResponse> }) =>
                              row.getValue('serviceName'),
                      },
                  ]
                : []),
            {
                accessorKey: 'joinDate',
                header: () => (
                    <DatePicker
                        selectedDate={joinSelectedDate}
                        onSelectDate={(date) => onDateChange(data.id, 'joinDate', date)}
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
                        onSelectDate={(date) => onDateChange(data.id, 'endDate', date)}
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
                        className='flex items-center text-gray-200 dark:text-gray-300 font-bold capitalize'
                    >
                        Left Days <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => {
                    const leftDays = row.original.leftDays;
                    return leftDays;
                },
            },
            {
                accessorKey: 'status',
                header: ({ column }) => (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='flex items-center text-gray-200 dark:text-gray-300 font-bold capitalize'
                    >
                        status <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => row.getValue('status'),
            },
            {
                accessorKey: 'serviceUser',
                header: ({ column }) => (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='flex items-center text-center text-gray-200 dark:text-gray-300 font-bold capitalize'
                    >
                        User Count <GoArrowSwitch className='rotate-90 text-xl ml-1.5' />
                    </Button>
                ),
                cell: ({ row }) => {
                    const serviceUserCount = row.original.serviceUser.length;
                    return <p className='text-center'>{serviceUserCount}</p>;
                },
            },
            {
                accessorKey: 'dealer',
                header: ({ column }) => {
                    const uniqueProviders = Array.from(
                        new Set(dealers.map(({ id, name }) => ({ id, name }))),
                    );

                    return (
                        <SelelectAndSearch
                            placeholder='Dealer'
                            className='text-gray-200 dark:text-gray-300 font-bold capitalize px-3'
                            options={uniqueProviders}
                            value={selectedDealer[data.id] ?? ''}
                            onChange={(value) => {
                                onDealerChange(data.id, value);
                                column.setFilterValue(value || undefined);
                            }}
                        />
                    );
                },
                cell: ({ row }) => (
                    <p className='capitalize font-medium'>{row.original.dealer.name}</p>
                ),
            },
            {
                id: 'actions',
                header: () => {
                    return (
                        <CustomDialogModal
                            buttonTitle={
                                <Button className='bg-green-500 text-white rounded-sm h-auto py-1 px-1.5 text-xl'>
                                    <FaPlus />
                                </Button>
                            }
                            title='acc data'
                            modalContentProps={
                                <AddAccDataModalCon
                                    dealers={dealers}
                                    serviceId={data?.id}
                                    onSubmit={(newUserData) => handleAddServiceAccunt(newUserData)}
                                />
                            }
                        />
                    );
                },
                cell: ({ row }) => {
                    const rowId = row.original.id;
                    return (
                        <CustomDialogModal
                            buttonTitle={
                                <span className='cursor-pointer text-xl'>
                                    <IoIosArrowForward />
                                </span>
                            }
                            title='acc data'
                            modalContentProps={
                                <EditAccDataModalCon
                                    rowData={row.original}
                                    dealers={dealers}
                                    onDelete={handleDeleteAccount}
                                    onEdit={(editedAccountData: TServiceAccountPayload) =>
                                        handleEditAccount(rowId ?? '', editedAccountData)
                                    }
                                />
                            }
                        />
                    );
                },
            },
        ],
        [
            data.id,
            dealers,
            endSelectedDate,
            handleAddServiceAccunt,
            handleDeleteAccount,
            handleEditAccount,
            joinSelectedDate,
            onDateChange,
            onDealerChange,
            selectedDealer,
            showServiceName,
        ],
    );

    return columns;
};

export default ServiceTableColumn;