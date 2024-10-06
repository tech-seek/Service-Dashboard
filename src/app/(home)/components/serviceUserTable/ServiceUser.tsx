'use client';

import { useSearchQuery } from '@/provider/use-search-provider';
import { ISerchParams } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { TServiceUserPayload } from '@/types/serviceUser';
import { createServiceUserAction } from '@/app/actions/serviceUser';
import { useServiceUserDependencies } from '@/app/dashboard/hooks';
import useShowToast from '@/app/hooks/useShowToast';
import { ButtonContainer } from '../buttonContainer';
import ServiceUserTable from './ServiceUserTable';
import { SERVICE_USERS } from '@/statics/queryKey';


export type THandleAddServiceUser = (payload: TServiceUserPayload) => void;
interface IProps extends ISerchParams {
    serviceName: string;
    isExpiring: boolean;
    isHideButtonContainer?: boolean;
    BGColor?: string;
    headerClasses?: string;
}
const ServiceUser = ({
    searchParams,
    serviceName,
    isExpiring,
    BGColor,
    headerClasses,
    isHideButtonContainer,
}: IProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const page = parseInt(searchParams['page'] ?? '1', 10);
    const limit = parseInt(searchParams['limit'] ?? '5', 10);

    const { searchQuery } = useSearchQuery();
    const queryClient = useQueryClient();
    const { showToast } = useShowToast();

    const handleAddUser = async (payload: TServiceUserPayload) => {
        const { data, error } = await createServiceUserAction(payload);
        if (error) {
            setIsOpen(false);
            return showToast(false, error);
        }
        const message = (data as { message: string }).message;
        showToast(true, message);
        queryClient.invalidateQueries({ queryKey: [SERVICE_USERS] });
        setIsOpen(false);
    };
    
    const {
        endSelectedDate,
        filterServiceUsers,
        handleDataChange,
        joinSelectedDate,
        selectedProvider,
        serviceAccounts,
        providers,
        services,
        setSelectedProvider,
        totalPage,
        isLoading,
        isPending,
    } = useServiceUserDependencies(
        `page=${page}&limit=${limit}&search=${searchQuery}`,
        page,
        limit,
        searchQuery,
        isExpiring,
    );
    return (
        <section className='mb-10'>
            <div className='container'>
                {!isHideButtonContainer && (
                    <ButtonContainer
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        handleAddUser={handleAddUser}
                        services={services ?? []}
                        servicesAccounts={serviceAccounts ?? []}
                    />
                )}
                <ServiceUserTable
                    data={filterServiceUsers}
                    services={services}
                    serviceAccounts={serviceAccounts}
                    onDateChange={handleDataChange}
                    joinSelectedDate={joinSelectedDate}
                    endSelectedDate={endSelectedDate}
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                    providers={providers}
                    serviceName={serviceName}
                    isLoading={isLoading}
                    isPending={isPending}
                    queryClient={queryClient}
                    queryPath={''}
                    isServiceNameEditable={false}
                    totalPage={totalPage}
                    BGColor={BGColor}
                    headerClasses={headerClasses}
                />
            </div>
        </section>
    );
};

export default ServiceUser;