'use server';

import { revalidatePath } from 'next/cache';
import { TDealerPayload } from '@/types/dealer';
import { tryCatch } from '@/lib/trycatch';


export const createDealerAction = async (payload: TDealerPayload) => {
    const [data, error] = await tryCatch('dealers', payload, { method: 'POST' });

    revalidatePath('/dashboard/add-dealer');
    return { data, error: error?.message };
};

export const editDealerAction = async (id: string, payload: TDealerPayload) => {
    const [data, error] = await tryCatch(`dealers/${id}`, payload, { method: 'PUT' });
    revalidatePath('/dashboard/add-dealer');
    return { data, error: error?.message };
};

export const deleteDealerAction = async (id: string) => {
    const [data, error] = await tryCatch(`dealers/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/dashboard/add-dealer');
    return { data, error: error?.message };
};