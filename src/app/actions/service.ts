'use server';

import { revalidatePath } from 'next/cache';
import { TServicePayload, TServiceResponse } from '@/types/service';
import { tryCatch } from '@/lib/trycatch';


export const createServiceAction = async (payload: TServicePayload) => {
    const [data, error] = await tryCatch('services', payload, { method: 'POST' });
    revalidatePath('/dashboard');
    return { data, error: error?.message };
};

export const updateServiceAction = async (id: string, payload: TServiceResponse) => {
    const [data, error] = await tryCatch(`services/${id}`, payload, { method: 'PUT' });
    revalidatePath('/dashboard');
    return { data, error: error?.message };
};

export const deleteServiceAction = async (id: string) => {
    const [data, error] = await tryCatch(`services/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/dashboard');
    return { data, error: error?.message };
};