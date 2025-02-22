import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { TableCell, TableRow } from './table';

interface TableSkeletonProps {
    TbodyClasses?: string;
    ThClasses?: string;
}
const TableSkeleton = ({ TbodyClasses, ThClasses }: TableSkeletonProps) => {
    return (
        <div className='w-full'>
            <Skeleton className='w-32  h-10 mx-auto mb-5 bg:zine-200 dark:bg-muted' />
            <Skeleton
                className={cn(
                    'w-full  h-10 rounded-b-none border-b border bg-primary/50',
                    ThClasses,
                )}
            />
            <Skeleton className={cn('w-full  h-44 rounded-t-none', TbodyClasses)} />
        </div>
    );
};

export default TableSkeleton;

export const TableRowSkeleton = ({
    length,
    TrClasses,
}: {
    length?: number;
    TrClasses?: string;
}) => {
    return (
        <TableRow>
            <TableCell colSpan={length}>
                <Skeleton className={`w-full h-10 ${TrClasses}`} />
            </TableCell>
        </TableRow>
    );
};
