import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import React, { FC, useMemo } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { TServiceAccountPayload, TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceUserResponse } from '@/types/serviceUser';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AccountEditForm from './AccountEditForm';

interface IProps {
    rowData?: TServiceAccountResponse;
    onDelete: (id: string) => void;
    onEdit: (editedUserData: TServiceAccountPayload) => void;
    dealers: TDealerResponse[];
}

const EditAccDataModalCon: FC<IProps> = ({ rowData, onDelete, onEdit, dealers }) => {
    const columns: ColumnDef<TServiceUserResponse>[] = useMemo(
        () => [
            { accessorKey: 'sl', header: 'sl', cell: ({ row }) => `#${row.index + 1}` },
            { accessorKey: 'name', header: 'name', cell: ({ row }) => row.getValue('name') },
            { accessorKey: 'type', header: 'type', cell: ({ row }) => row.getValue('type') },
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
                accessorKey: 'joinDate',
                header: 'Join Date',
                cell: ({ row }) => {
                    const joinDate = row.getValue('joinDate');
                    return format(joinDate as Date, 'dd MMM yyyy');
                },
            },
            {
                accessorKey: 'leftDays',
                header: 'End Date',
                cell: ({ row }) => {
                    const leftDays = row.getValue('leftDays');
                    return `${leftDays} days`;
                },
            },
        ],
        [],
    );

    const rowDataUsers = rowData?.serviceUser ?? [];
    const table = useReactTable({
        data: rowDataUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div>
            <AccountEditForm
                rowData={rowData}
                onDelete={onDelete}
                onEdit={onEdit}
                dealers={dealers}
            >
                <div className='h-56 mt-4 overflow-y-auto'>
                    <Table className='overflow-visible'>
                        <TableHeader className='text-white'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    className='sticky top-0 bg-zinc-700  hover:bg-zinc-600'
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

                        {/* Table Body */}
                        <TableBody className='bg-secondary h-full'>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className='bg-cream hover:bg-cream w-full'
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className='whitespace-nowrap text-gray-800 border-b-4 border-b-gray-900 first:rounded-l last:rounded-r'
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
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
            </AccountEditForm>
        </div>
    );
};

export default EditAccDataModalCon;
