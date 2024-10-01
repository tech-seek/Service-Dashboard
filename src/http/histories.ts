import { THistoryResponse } from '@/types/history';
import { tryCatch } from '@/lib/trycatch';

export type THistoryData = {
    data: { histories: THistoryResponse[]; totalRecords: number };
};

export const getHistories = async (query: string) => {
    const [data, error] = await tryCatch<THistoryData>(`histories?${query}`);
    if (error) {
        throw new Error(`${error?.message}`);
    }
    return data;
};
