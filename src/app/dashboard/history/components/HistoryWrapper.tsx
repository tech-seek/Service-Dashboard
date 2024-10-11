'use client';

import { getHistories } from '@/http/histories'; // Assume you have a deleteHistory function in your API
import { useSearchQuery } from '@/provider/use-search-provider';
import { HISTORY } from '@/statics/queryKey';
import { ISerchParams } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { memo, useCallback, useMemo } from 'react';
import { THistoryResponse } from '@/types/history';
import { useFetchData } from '@/lib/useFetchData';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';
import { CustomTable } from '@/components/ui/customTable';
import TableSkeleton from '@/components/ui/table-skeleton';
import { deleteHistoryActions } from '@/app/actions/history';
import useShowToast from '@/app/hooks/useShowToast';

const HistoryWrapper = ({ searchParams }: ISerchParams) => {
    const page = parseInt(searchParams['page'] ?? '1', 10);
    const limit = parseInt(searchParams['limit'] ?? '10', 10);
    const { searchQuery } = useSearchQuery();
    const { showToast } = useShowToast();
    const queryClient = useQueryClient();
    const fetchGetHistories = () => {
        return getHistories(`page=${page}&limit=${limit}&search=${searchQuery}`);
    };

    const {
        data: result,
        isLoading,
        isPending,
    } = useFetchData([HISTORY, page.toString(), limit.toString(), searchQuery], fetchGetHistories);

    // Delete function
    const handleDelete = useCallback(
        async (id: string) => {
            try {
                const { data, error } = await deleteHistoryActions(id);
                if (error) return showToast(false, error);
                const message = (data as { message: string }).message;
                showToast(true, message);
            } catch (error) {
                showToast(false, 'Failed to delete history record.');
            } finally {
                queryClient.invalidateQueries({ queryKey: [HISTORY] });
            }
        },
        [queryClient, showToast],
    );

    const columns: ColumnDef<THistoryResponse>[] = useMemo(
        () => [
            {
                accessorKey: 'sl',
                header: 'Sl No ',
                cell: ({ row }) => `#${row.index + 1}`,
                enableSorting: true,
            },
            {
                accessorKey: 'phone',
                header: 'Number',
                cell: ({ row }) => row.getValue('phone'),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => row.getValue('name'),
            },
            {
                accessorKey: 'service',
                header: 'Services',
                cell: ({ row }) => {
                    const service = row.original.services;
                    return service.name;
                },
            },
            {
                accessorKey: 'provider',
                header: 'Provider',
                cell: ({ row }) => {
                    const provider = row.original.providers;
                    return provider.userName;
                },
            },
            {
                accessorKey: 'lastExpire',
                header: 'Last Expire',
                cell: ({ row }) => row.getValue('lastExpire'),
            },
            {
                id: 'actions', // Unique identifier for the actions column
                header: 'Actions',
                cell: ({ row }) => {
                    const historyId = row.original.id; // Assuming 'id' exists in THistoryResponse
                    return (
                        <CustomAlertDialog
                            buttonTitle='Delete'
                            messageTitle='Are you absolutely sure?'
                            message='This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
                            onClick={() => handleDelete(historyId)}
                        />
                    );
                },
            },
        ],
        [handleDelete],
    );

    const memorizeHistories = useMemo(() => result?.data.histories, [result?.data.histories]);

    if (!memorizeHistories || memorizeHistories.length === 0) {
        return (
            <div className='grid place-items-center mt-4 md:mt-8 gap-10'>
                <TableSkeleton TbodyClasses='h-[58dvh]' />
            </div>
        );
    }
    return (
        <CustomTable
            columns={columns as THistoryResponse[]}
            filteredData={memorizeHistories ?? []}
            isLoading={isLoading || isPending}
            serviceName='History'
            tcellClasses='text-left'
            isServiceNameEditable={false}
            totalPage={result?.data.totalRecords ?? 1}
        />
    );
};

export default memo(HistoryWrapper);
