import { TServiceUserResponse } from '@/types/serviceUser';
import { tryCatch } from '@/lib/trycatch';

export type TServiceUsersDataWithPagination = {
    data: {
        serviceUsers: TServiceUserResponse[];
        totalRecords: number;
        serviceId: string;
    };
};
export type TServiceUsersData = {
    data: TServiceUserResponse[];
};
// const { data: serviceUsers } = useFetchData(['serviceUsers'], fetchServiceUsersData);
export const fetchServiceUsersData = async () => {
    const [data, error] = await tryCatch<TServiceUsersData>('service-users');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};

export const fetchQueryServicesUserQueryData = async (query: string) => {
    const [data, error] = await tryCatch<TServiceUsersDataWithPagination>(`service-users?${query}`);
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};
export const fetchQueryServicesUserOnGoing = async (query: string) => {
    const [data, error] = await tryCatch<TServiceUsersDataWithPagination>(
        `service-users/ongoing?search=${query}`,
    );
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};
export const fetchQueryServicesUserExpiring = async (query: string) => {
    const [data, error] = await tryCatch<TServiceUsersDataWithPagination>(
        `service-users/expiring?search=${query}`,
    );
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};
