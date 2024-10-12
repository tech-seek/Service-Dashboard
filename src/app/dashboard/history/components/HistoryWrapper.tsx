'use client';

import { getHistories } from '@/http/histories'; // Assume you have a deleteHistory function in your API
import { useSearchQuery } from '@/provider/use-search-provider';
import { HISTORY } from '@/statics/queryKey';
import { ISerchParams } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { THistoryResponse } from '@/types/history';
import { useFetchData } from '@/lib/useFetchData';
import { cn } from '@/lib/utils';
import { CustomAlertDialog } from '@/components/ui/customAlertDialog';
import { CustomRow } from '@/components/ui/customRow';
import PaginationButtons from '@/components/ui/pagination-buttons';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import TableSkeleton, { TableRowSkeleton } from '@/components/ui/table-skeleton';
import { deleteHistoryActions } from '@/app/actions/history';
import useShowToast from '@/app/hooks/useShowToast';

const HistoryWrapper = ({ searchParams }: ISerchParams) => {
    const page = parseInt(searchParams['page'] ?? '1', 10);
    const limit = parseInt(searchParams['limit'] ?? '10', 10);
    const { searchQuery } = useSearchQuery();
    const { showToast } = useShowToast();
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    const router = useRouter();
    const fetchGetHistories = () => {
        return getHistories(`page=${page}&limit=${limit}&search=${searchQuery}`);
    };

    const { data: result, isLoading } = useFetchData(
        [HISTORY, page.toString(), limit.toString(), searchQuery],
        fetchGetHistories,
    );

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
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const historyId = row.original.id;
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

    // Table sorting and row model
    const { getHeaderGroups, getRowModel } = useReactTable({
        data: memorizeHistories ?? [],
        columns,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    });

    // Pagination handling
    const totalRecords = result?.data.totalRecords ?? 0;
    const totalPages = Math.ceil(totalRecords / limit);

    // Update query params and navigate using router.push
    const handlePageChange = useCallback(
        (newPage: number) => {
            const query = new URLSearchParams(searchParams);
            query.set('page', newPage.toString());
            router.push(`?${query.toString()}`);
        },
        [router, searchParams],
    );

    const handleRowsPerPageChange = useCallback(
        (value: string) => {
            const query = new URLSearchParams(searchParams);
            query.set('limit', value);
            router.push(`?${query.toString()}`);
        },
        [router, searchParams],
    );
    if (!memorizeHistories || memorizeHistories.length === 0) {
        return (
            <div className='grid place-items-center mt-4 md:mt-8 gap-10'>
                <TableSkeleton TbodyClasses='h-[58dvh]' />
            </div>
        );
    }

    return (
        <div className='mt-4 md:mt-8'>
            <div className='w-fit px-4 mx-auto'>
                <h3 className='font-bold  inline-flex gap-2  dark:text-white text-3xl md:text-2xl uppercase mb-4 '>
                    History - <p>{totalRecords ?? 0}</p>
                </h3>
            </div>

            <Table className='overflow-visible w-full'>
                <TableHeader className='text-white'>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className={cn('sticky top-0 bg-primary hover:bg-primary')}
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className='whitespace-nowrap text-gray-200 dark:text-gray-300 font-bold capitalize'
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className='bg-secondary h-full'>
                    {getRowModel().rows.length ? (
                        getRowModel().rows.map((row) =>
                            isLoading ? (
                                <TableRowSkeleton length={columns.length} key={row.id} />
                            ) : (
                                <CustomRow key={row.id} row={row ?? {}} />
                            ),
                        )
                    ) : isLoading ? (
                        Array.from({ length: 6 }, (_, i) => (
                            <TableRowSkeleton key={i} length={columns.length} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='text-center pt-16 text-xl'
                            >
                                No data available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <PaginationButtons
                currentPage={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={limit}
            />
        </div>
    );
};

export default memo(HistoryWrapper);
