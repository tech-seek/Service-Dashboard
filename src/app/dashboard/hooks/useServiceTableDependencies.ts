'use client';

import { fetchDealerData, fetchQueryServicesAccQueryData } from '@/http';
import { DEALERS, SERVICE_ACCOUNTS } from '@/statics/queryKey';
import { useCallback, useMemo, useState } from 'react';
import { useFetchData } from '@/lib/useFetchData';
import { useFilteredServiceAccounts } from './useFilteredServiceAccounts';

export const useServiceTableDependencies = (
    query: string,
    page: number,
    limit: number,
    searchQuery: string,
    expiring?: string,
) => {
    // Initialize state to store the selected dealer for each service
    const [selectedDealer, setSelectedDealer] = useState<{ [serviceId: string]: string | null }>(
        // Initialize it as an empty object
        {},
    );

    // Initialize state to store the selected dates for each service
    const [selectedDates, setSelectedDates] = useState<{
        [serviceId: string]: { joinDate?: Date; endDate?: Date };
    }>(
        // Initialize it as an empty object
        {},
    );
    //NOTE: is something unexpected happen for services then use te services query form here by uncommenting the below code
    // Fetch services data
    // const { data: services } = useFetchData([SERVICES], fetchServicesData);

    // Fetch dealers data
    const { data: dealers } = useFetchData([DEALERS], fetchDealerData);

    // Fetch service accounts data based on the query
    const fetchQueryServicesAcc = () => fetchQueryServicesAccQueryData(query);

    // Fetch service accounts data with pagination
    const {
        data: res,
        isPending,
        isLoading,
    } = useFetchData(
        [SERVICE_ACCOUNTS, page.toString(), limit.toString(), searchQuery, String(expiring)],
        fetchQueryServicesAcc,
    );

    // extract all services
    const services = useMemo(() => res?.data.services ?? [], [res?.data.services]);

    // Handle date change
    const handleDateChange = useCallback(
        // The callback function takes a service id, a date type (joinDate or endDate) and a date
        (serviceId: string, dateType: 'joinDate' | 'endDate', date: Date | undefined) => {
            // Update the selectedDates state with the new date
            setSelectedDates((prev) => ({
                // Keep all the previous selected dates
                ...prev,
                // Update the selected date for the given service id
                [serviceId]: {
                    // Keep all the previous selected dates for the given service id
                    ...prev[serviceId],
                    // Update the selected date for the given date type
                    [dateType]: date,
                },
            }));
        },
        // The dependency array is empty because we don't want this callback to be recreated
        // on every render
        [],
    );

    // Handle dealer change
    const handleDealerChange = useCallback(
        // The callback function takes a service id and a dealer
        (serviceId: string, dealer: string | null) => {
            // Update the selectedDealer state with the new dealer
            setSelectedDealer((prev) => ({
                // Keep all the previous selected dealers
                ...prev,
                // Update the selected dealer for the given service id
                [serviceId]: dealer,
            }));
        },
        // The dependency array is empty because we don't want this callback to be recreated
        // on every render
        [],
    );

    // Memoize the dealers data so that we don't re-fetch it on every render
    const memorizedDealers = useMemo(() => dealers?.data ?? [], [dealers?.data]);

    // Memoize the service accounts data so that we don't re-fetch it on every render
    const memorizedAccounts = useMemo(
        // Return the service accounts data or an empty array if it's not available
        () => res?.data.serviceAccounts ?? [],
        // The dependency array is the service accounts data
        [res?.data.serviceAccounts],
    );
    // Filter data based on selected dealer and dates
    const filterServiceAccounts = useFilteredServiceAccounts({
        selectedDates,
        selectedDealer,
        dealers: memorizedDealers,
        serviceAccountsData: memorizedAccounts,
    });

    return {
        dealers: memorizedDealers,
        totalPage: res?.data.totalRecords,
        services,
        selectedDealer,
        selectedDates,
        isLoading,
        isPending,
        handleDealerChange,
        handleDateChange,
        filterServiceAccounts,
    };
};
