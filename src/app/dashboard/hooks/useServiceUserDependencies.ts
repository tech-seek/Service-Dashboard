'use client';

import { fetchAllServicesAcc, fetchQueryServicesUserExpiring, fetchQueryServicesUserOnGoing, fetchServicesData, getUsers } from '@/http';
import { useMemo, useState } from 'react';
import { useFetchData } from '@/lib/useFetchData';
import { useFilteredServiceUsers } from './useFilterdServiceUsers';


export const useServiceUserDependencies = (
    query: string,
    page: number,
    limit: number,
    searchQuery: string,
    isExpiring: boolean,
) => {
    const [selectedProvider, setSelectedProvider] = useState<string>();
    const [selectedDates, setSelectedDates] = useState<{ joinDate?: Date; endDate?: Date }>({});
    const fetchServiceUser = isExpiring
        ? () => fetchQueryServicesUserExpiring(query)
        : () => fetchQueryServicesUserOnGoing(query);

    const {
        data: res,
        isLoading,
        isPending,
    } = useFetchData(
        ['serviceUsers', page.toString(), limit.toString(), isExpiring.toString(), searchQuery,query],
        fetchServiceUser,
    );

    const { data: services } = useFetchData(['services'], fetchServicesData);
    const { data: serviceAccounts } = useFetchData(['serviceAccounts'], fetchAllServicesAcc);
    const { data: users } = useFetchData(['users'], getUsers);

    const memorizeProviders = useMemo(() => users?.data ?? [], [users?.data]);

    const memorizeServiceUser = useMemo(
        () => res?.data.serviceUsers ?? [],
        [res?.data.serviceUsers],
    );

    const filterServiceUsers = useFilteredServiceUsers({
        selectedDates,
        selectedProvider: selectedProvider ?? '',
        providers: memorizeProviders,
        serviceUserData: memorizeServiceUser ?? [],
    });
    const memorizeServices = useMemo(() => services?.data ?? [], [services?.data]);
    const memorizeServiceAccounts = useMemo(
        () => serviceAccounts?.data ?? [],
        [serviceAccounts?.data],
    );

    const handleDataChange = (dateType: 'joinDate' | 'endDate', date: Date | undefined) => {
        setSelectedDates((prevDate) => ({
            ...prevDate,
            [dateType]: date,
        }));
    };

    return {
        serviceUsers: memorizeServiceUser ?? [],
        services: memorizeServices,
        totalPage: res?.data.totalRecords ?? 1,
        providers: memorizeProviders,
        serviceAccounts: memorizeServiceAccounts,
        joinSelectedDate: selectedDates.joinDate,
        endSelectedDate: selectedDates.endDate,
        isLoading: isLoading,
        isPending: isPending,
        filterServiceUsers,
        selectedProvider,
        setSelectedProvider,
        handleDataChange,
    };
};