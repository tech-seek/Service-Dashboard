import { flexRender, Row } from '@tanstack/react-table';
import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { TableCell, TableRow } from '../table';
import { TServiceAccountResponse } from '@/types/serviceAccount';
import { TServiceUserResponse } from '@/types/serviceUser';
import { THistoryResponse } from '@/types/history';


interface IProps {
    BGColor?: string;
    row: Row<TServiceAccountResponse | TServiceUserResponse | THistoryResponse>;
    tcellClasses?: string;
}

const CustomRow: FC<IProps> = ({ row, BGColor, tcellClasses }) => {
  return (
    <TableRow className={`${BGColor} hover:${BGColor} `}>
      {row.getVisibleCells().map((cell, index) => (
        <TableCell className={cn(
          `whitespace-nowrap border-b dark:border-b-gray-700`,
          [5,6, 7,8,9].includes(index) ? 'text-center' : 'text-start',
          tcellClasses
        )} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default CustomRow