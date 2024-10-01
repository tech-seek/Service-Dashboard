import { TMultipleServiceAccTotalRecords, TServiceAccountResponse } from '@/types/serviceAccount';
import { tryCatch } from '@/lib/trycatch';


export type TServiceAccountData = {
    data: {
        serviceAccounts: TServiceAccountResponse[];
        totalRecords: TMultipleServiceAccTotalRecords;
        serviceId: string;
    };
};
export type TServiceAllAccData = {
    data: TServiceAccountResponse[];
};
// const { data: serviceAccounts } = useFetchData(['serviceAccounts'], fetchServiceAccuntData);
export const fetchServiceAccuntData = async () => {
    const [data, error] = await tryCatch<TServiceAccountData>('service-accounts');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};

export const fetchQueryServicesAccQueryData = async (query: string) => {
    const [data, error] = await tryCatch<TServiceAccountData>(`service-accounts?${query}`);
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};

export const fetchAllServicesAcc = async () => {
    const [data, error] = await tryCatch<TServiceAllAccData>(`service-accounts?all=true`);
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};