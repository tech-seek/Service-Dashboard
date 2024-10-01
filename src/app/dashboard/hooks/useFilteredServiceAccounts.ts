import { endOfDay, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { TDealerResponse } from '@/types/dealer';
import { TServiceAccountResponse } from '@/types/serviceAccount';

interface UseFilteredServiceAccountsParams {
    serviceAccountsData: TServiceAccountResponse[] | undefined;
    selectedDealer: { [serviceId: string]: string | null };
    selectedDates: { [serviceId: string]: { joinDate?: Date; endDate?: Date } };
    dealers: TDealerResponse[];
}

export const useFilteredServiceAccounts = ({
    serviceAccountsData,
    selectedDealer,
    selectedDates,
    dealers,
}: UseFilteredServiceAccountsParams) => {
    return useMemo(() => {
        /**
         * Filters service accounts based on the following criteria:
         *
         * 1. If there is a search query, the service account's email must contain the search query.
         * 2. The selected dealer must match the dealer of the service account.
         *    If no dealer is selected, this condition is ignored.
         * 3. The selected join date must be after the service account's join date.
         *    If no join date is selected, this condition is ignored.
         * 4. The selected end date must be before the service account's end date.
         *    If no end date is selected, this condition is ignored.
         *
         * @param serviceId The ID of the service for which to filter service accounts.
         * @returns A function that takes a service ID and returns an array of filtered service accounts.
         */
        const filteredData = (serviceId: string) => {
            return (serviceAccountsData ?? []).filter((account) => {
                // Dealer matching
                const dealerId = dealers.find(({ name }) => name === selectedDealer[serviceId])?.id;
                const dealerMatch = selectedDealer[serviceId]
                    ? account.dealerId === dealerId
                    : true;

                // Date matching
                const selectedJoinDate = selectedDates[serviceId]?.joinDate;
                const selectedEndDate = selectedDates[serviceId]?.endDate;

                let joinDateMatch = true;
                let endDateMatch = true;

                if (selectedJoinDate) {
                    // The join date must be after the start of the selected date
                    joinDateMatch =
                        isAfter(account.joinDate, startOfDay(selectedJoinDate)) ||
                        // or it must be equal to the start of the selected date
                        isEqual(account.joinDate, startOfDay(selectedJoinDate));
                }

                if (selectedEndDate) {
                    // The end date must be before the end of the selected date
                    endDateMatch =
                        isBefore(account.endDate, endOfDay(selectedEndDate)) ||
                        // or it must be equal to the end of the selected date
                        isEqual(account.endDate, endOfDay(selectedEndDate));
                }

                return (
                    account.serviceId === serviceId && dealerMatch && joinDateMatch && endDateMatch
                );
            });
        };

        return filteredData;
    }, [serviceAccountsData, dealers, selectedDealer, selectedDates]);
};
