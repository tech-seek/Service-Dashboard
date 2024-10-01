'use client';

import React, { FC } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { TServiceResponse } from '@/types/service';
import { TMultipleServiceAccTotalRecords, TServiceAccountResponse } from '@/types/serviceAccount';
import { CustomTable } from '@/components/ui/customTable';
import ServiceTableColumn from './ServiceTableColumn';

type THandeDateChange = (
    serviceId: string,
    dateType: 'joinDate' | 'endDate',
    date: Date | undefined,
) => void;
interface IProps {
    item: TServiceResponse | TServiceResponse[]; // Updated to allow both object and array
    selectedDealer: { [serviceId: string]: string | null };
    selectedDates: { [serviceId: string]: { joinDate?: Date; endDate?: Date } };
    isLoading: boolean;
    isPending: boolean;
    dealers: TDealerResponse[] | undefined;
    queryPath?: string;
    totalPage: TMultipleServiceAccTotalRecords;
    handleDateChange: THandeDateChange;
    handleDealerChange: (serviceId: string, dealer: string | null) => void;
    filterServiceAccounts: (serviceId: string) => TServiceAccountResponse[];
}
export type TServiceRenderTable = IProps;

const RenderTable: FC<IProps> = ({
    item,
    filterServiceAccounts,
    selectedDealer,
    selectedDates,
    isLoading,
    isPending,
    handleDealerChange,
    handleDateChange,
    dealers,
    queryPath,
    totalPage,
}) => {
    // If the item is an array, we'll loop through it and combine all the
    // service accounts into one array. If it's not an array, we'll just put
    // the one item in an array.
    const itemsArray = Array.isArray(item) ? item : [item];

    // We need to take all the service accounts from all the items and
    // merge them into one array. We'll use the filterServiceAccounts
    // function to get all the service accounts for each item, and then
    // flatten the array of arrays into one array.
    const mergedData = itemsArray.flatMap((singleItem) =>
        filterServiceAccounts(singleItem.id).map((account) => ({
            // We're going to add the serviceName property to each service
            // account object, so that we can display it in the table.
            // We'll use the name of the item that the service account
            // belongs to.
            ...account,
            serviceName: singleItem.name,
        })),
    );

    // We're going to use the first item in the array to set up our
    // column configurations. We'll use its properties to determine
    // what columns we need to display.
    const firstItem = itemsArray[0];

    // We'll use the first item to define our columns. We'll use the
    // ServiceTableColumn component to define the columns for each
    // item in the array.
    const columns = firstItem
        ? ServiceTableColumn({
              data: firstItem,
              dealers: dealers ?? [],
              selectedDealer,
              onDealerChange: handleDealerChange,
              joinSelectedDate: selectedDates[firstItem.id]?.joinDate,
              endSelectedDate: selectedDates[firstItem.id]?.endDate,
              onDateChange: handleDateChange,
              showServiceName: true,
          })
        : [];

    return (
        <CustomTable
            columns={columns as TServiceAccountResponse[]}
            filteredData={mergedData}
            key={firstItem?.id}
            serviceId={firstItem?.id}
            serviceName={firstItem?.name}
            isLoading={isLoading || isPending}
            totalPage={totalPage}
            queryPath={queryPath}
        />
    );
};

export default RenderTable;
