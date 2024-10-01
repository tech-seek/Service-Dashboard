import { TServiceResponse } from '@/types/service';
import { tryCatch } from '@/lib/trycatch';

export type TServicesData = {
    data: TServiceResponse[];
};
// const { data: services } = useFetchData(['services'], fetchServicesData);
export const fetchServicesData = async () => {
    const [data, error] = await tryCatch<TServicesData>('services');
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};
