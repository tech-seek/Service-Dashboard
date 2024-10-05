import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DeleteData, EditModeretorData } from '.';
import EditDealerData from './EditDealerData';

export interface IListItem {
    id: string;
    name: string;
    password?: string;
}

interface IProps {
    data: IListItem[];
    heading: string;
    onDelete?: (id: string) => void;
    onEdit: (updatedUser: IListItem) => void;
    CardContainerClass?: string;
    isDealerPage?: boolean;
}

const DataList: FC<IProps> = ({
    data,
    heading,
    onDelete,
    onEdit,
    isDealerPage,
    CardContainerClass,
}) => {
    return (
        <div className='grid place-items-center max-h-[600px] overflow-y-auto'>
            <h1 className='text-xl font-bold mb-5'>{heading}</h1>
            {data.length === 0 ? (
                <h1>No data to show</h1>
            ) : (
                <ul className={cn('w-full max-w-lg')}>
                    {(data ?? []).map((item) => {
                        return (
                            <li key={item?.id} className='mb-4 last:mb-0'>
                                <Card className='rounded-md'>
                                    <CardContent
                                        className={cn(
                                            'px-4 py-2 flex items-center justify-between  gap-2 w-full max-w-full *:font-semibold',
                                            CardContainerClass,
                                        )}
                                    >
                                        <div>
                                            <p>
                                                {isDealerPage ? 'Name' : 'User Name'}: {item.name}
                                            </p>
                                            {item.password && <p>Password: {item.password}</p>}
                                        </div>
                                        <div className='flex gap-2 items-center *:size-5'>
                                            {isDealerPage ? (
                                                <EditDealerData dealer={item} onEdit={onEdit} />
                                            ) : (
                                                <EditModeretorData user={item} onEdit={onEdit} />
                                            )}

                                            {onDelete && (
                                                <DeleteData onDelete={onDelete} id={item?.id} />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default DataList;
