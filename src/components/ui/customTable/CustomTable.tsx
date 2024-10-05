'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { THistoryResponse } from '@/types/history';
import { TMultipleServiceAccTotalRecords, TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceUserResponse } from '@/types/serviceUser';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import ServiceName from '@/app/dashboard/components/services/ServiceName';
import { IServiceUser } from '@/app/types/service';
import { CustomRow } from '../customRow';
import PaginationButtons from '../pagination-buttons';
import { TableRowSkeleton } from '../table-skeleton';

// Define your user type and columns
export type TFilterdUser = IServiceUser['usersData'] & { joinDate?: string; endDate?: string };
type TFilterData = TServiceAccountResponse | TServiceUserResponse | THistoryResponse;
type TColumns = ColumnDef<TFilterData>[];

interface IProps {
    serviceId?: string;
    serviceName: string;
    filteredData: TFilterData[];
    columns: TColumns;
    BGColor?: string;
    headerClasses?: string;
    tcellClasses?: string;
    isLoading?: boolean;
    queryPath?: string;
    isServiceNameEditable?: boolean;
    totalPage: TMultipleServiceAccTotalRecords;
}

const CustomTable: FC<IProps> = ({
    serviceId = '',
    serviceName,
    filteredData,
    columns,
    BGColor,
    headerClasses,
    tcellClasses,
    isLoading,
    queryPath,
    isServiceNameEditable = true,
    totalPage,
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const pathName = usePathname();
    const isMultiTableAtSamePage = pathName === '/' || pathName === '/dashboard';
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(isMultiTableAtSamePage ? 5 : 10); // Default limit per page
    const router = useRouter();
    const totalPages =
        typeof totalPage === 'number'
            ? Math.ceil(totalPage / limit)
            : Math.ceil(totalPage[serviceId] / limit);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (value: string) => {
        setLimit(Number(value));
        setPage(1); // Reset to first page when changing rows per page
    };
    // Update URL when page or limit changes
    useEffect(() => {
        router.push(`?page=${page}&limit=${limit}${queryPath ? '&q=' + queryPath : ''}`);
    }, [page, limit, router, queryPath]);

    const handleSortingChange = useCallback(
        (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
            setSorting(updaterOrValue);
        },
        [],
    );

    const { getHeaderGroups, getRowModel } = useReactTable({
        data: filteredData,
        columns,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: handleSortingChange,
    });
    const fullHight = ['/dashboard/expireing', '/dashboard/history'];
    return (
        <div className='mt-4 md:mt-8'>
            {/* service name */}
            {pathName.startsWith('/dashboard/expireing') || !isServiceNameEditable ? (
                <div className='w-fit px-4 mx-auto'>
                    <h3 className='font-bold inline-block  dark:text-white text-3xl md:text-2xl uppercase mb-4 '>
                        {serviceName}
                    </h3>
                </div>
            ) : (
                <ServiceName name={serviceName} serviceId={serviceId ?? ''} />
            )}

            <div
                className={cn(
                    'h-56 overflow-y-auto bg-secondary',
                    {
                        'h-[58dvh]': fullHight.includes(pathName),
                    },
                    {
                        'h-full min-h-[58dvh]': limit >= 50,
                    },
                )}
            >
                <Table className='overflow-visible'>
                    <TableHeader className='text-white'>
                        {getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                className={cn(
                                    'sticky top-0 bg-primary hover:bg-primary',
                                    headerClasses,
                                )}
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
                                    <CustomRow
                                        tcellClasses={tcellClasses}
                                        BGColor={BGColor}
                                        key={row.id}
                                        row={row ?? {}}
                                    />
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
            </div>
            {/* Pagination controls */}
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

export default CustomTable;
