import React, { FC, memo } from 'react';
import { TServiceUserResponse } from '@/types/serviceUser';
import { CustomTable } from '@/components/ui/customTable';
import ServiceUserTableColumns, { IServiceUserTableColumns } from './ServiceUserTableColumns';

interface Props extends IServiceUserTableColumns {
    isLoading: boolean;
    isPending: boolean;
    queryPath: string;
    serviceName: string;
    BGColor?: string;
    headerClasses?: string;
    isServiceNameEditable: boolean;
    totalPage: number;
}
const ServiceUserTable: FC<Props> = ({
    data,
    serviceAccounts,
    services,
    providers,
    endSelectedDate,
    joinSelectedDate,
    selectedProvider,
    setSelectedProvider,
    selectedService,
    setSelectedService,
    isLoading,
    isPending,
    queryPath,
    serviceName,
    totalPage,
    onDateChange,
    BGColor,
    headerClasses,
    queryClient,
    isServiceNameEditable,
}) => {
    const columns = ServiceUserTableColumns({
        data,
        serviceAccounts,
        services,
        providers,
        endSelectedDate,
        onDateChange,
        joinSelectedDate,
        selectedProvider,
        setSelectedProvider,
        selectedService,
        setSelectedService,
        queryClient,
    });
    return (
        <CustomTable
            columns={columns as TServiceUserResponse[]}
            filteredData={data}
            serviceName={serviceName}
            isLoading={isLoading || isPending}
            totalPage={totalPage}
            queryPath={queryPath}
            BGColor={BGColor}
            headerClasses={headerClasses}
            isServiceNameEditable={isServiceNameEditable}
        />
    );
};

export default memo(ServiceUserTable);
