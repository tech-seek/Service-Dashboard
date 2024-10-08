import { endOfDay, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { TServiceResponse } from '@/types/service';
import { TServiceUserResponse } from '@/types/serviceUser';
import { TUserRespone } from '@/types/user';

interface UseFilteredServiceUsersParams {
    serviceUserData: TServiceUserResponse[] | undefined;
    selectedProvider: string;
    selectedService: string;
    selectedDates: { joinDate?: Date; endDate?: Date };
    providers: TUserRespone[];
    services: TServiceResponse[];
}

export const useFilteredServiceUsers = ({
    serviceUserData,
    selectedProvider,
    selectedService,
    services,
    selectedDates,
    providers,
}: UseFilteredServiceUsersParams) => {
    return useMemo(() => {
        return (serviceUserData ?? []).filter((serviceUser) => {
            // Dealer matching
            const providerName = providers.find(
                ({ userName }) => userName === selectedProvider,
            )?.userName;
            const providerMatch = selectedProvider
                ? serviceUser.providerName === providerName
                : true;
            // Service matching
            const serviceId = services.find(({ name }) => name === selectedService)?.id;
            const serviceMatch = selectedService ? serviceUser.serviceId === serviceId : true;
            // Date matching
            const selectedJoinDate = selectedDates?.joinDate;
            const selectedEndDate = selectedDates?.endDate;

            let joinDateMatch = true;
            let endDateMatch = true;

            if (selectedJoinDate) {
                // The join date must be after the start of the selected date
                joinDateMatch =
                    isAfter(serviceUser.joinDate, startOfDay(selectedJoinDate)) ||
                    // or it must be equal to the start of the selected date
                    isEqual(serviceUser.joinDate, startOfDay(selectedJoinDate));
            }

            if (selectedEndDate) {
                // The end date must be before the end of the selected date
                endDateMatch =
                    isBefore(serviceUser.endDate, endOfDay(selectedEndDate)) ||
                    // or it must be equal to the end of the selected date
                    isEqual(serviceUser.endDate, endOfDay(selectedEndDate));
            }

            return providerMatch && joinDateMatch && endDateMatch && serviceMatch;
        });
    }, [
        serviceUserData,
        providers,
        selectedProvider,
        services,
        selectedService,
        selectedDates?.joinDate,
        selectedDates?.endDate,
    ]);
};
