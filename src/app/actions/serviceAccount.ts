'use server';

import { revalidatePath } from 'next/cache';
import { TServiceAccountPayload } from '@/types/serviceAccount';
import { tryCatch } from '@/lib/trycatch';


export const createServiceAccuntAction = async (payload: TServiceAccountPayload) => {
    const [data, error] = await tryCatch('service-accounts', payload, { method: 'POST' });

    revalidatePath('/dashboard');
    return { data, error: error?.message };
};

export const updateServiceAccuntAction = async (id: string, payload: TServiceAccountPayload) => {
    const [data, error] = await tryCatch(`service-accounts/${id}`, payload, { method: 'PUT' });
    revalidatePath('/dashboard');    
    return { data, error: error?.message };
};

export const deleteServiceAccuntAction = async (id: string) => {
    const [data, error] = await tryCatch(`service-accounts/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/dashboard');
    return { data, error: error?.message };
};