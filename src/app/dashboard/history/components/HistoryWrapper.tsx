'use client';

import { getHistories } from '@/http/histories';
import { useSearchQuery } from '@/provider/use-search-provider';
import { ISerchParams } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { THistoryResponse } from '@/types/history';
import { useFetchData } from '@/lib/useFetchData';
import { CustomTable } from '@/components/ui/customTable';
import TableSkeleton from '@/components/ui/table-skeleton';

const HistoryWrapper = ({ searchParams }: ISerchParams) => {
    const page = parseInt(searchParams['page'] ?? '1', 10);
    const limit = parseInt(searchParams['limit'] ?? '10', 10);
    const { searchQuery } = useSearchQuery();

    const fetchGetHistories = () => {
        return getHistories(`page=${page}&limit=${limit}&search=${searchQuery}`);
    };

    const {
        data: result,
        isLoading,
        isPending,
    } = useFetchData(
        ['histories', page.toString(), limit.toString(), searchQuery],
        fetchGetHistories,
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
                header: 'services',
                cell: ({ row }) => {
                    const service = row.original.services;
                    // return service.map((s) => s.name).join(', ');
                    return service.name;
                },
            },
            {
                accessorKey: 'provider',
                header: 'Provider',
                cell: ({ row }) => {
                    const provider = row.original.providers;
                    // return provider.map((p) => p.userName).join(', ');
                    return provider.userName;
                },
            },
            {
                accessorKey: 'lastExpire',
                header: 'Last Expire',
                cell: ({ row }) => row.getValue('lastExpire'),
            },
        ],
        [],
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
            totalPage={result?.data.totalRecords ?? 1}
        />
    );
};

export default HistoryWrapper;
