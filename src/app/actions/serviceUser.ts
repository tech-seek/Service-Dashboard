'use server';

import { revalidatePath } from 'next/cache';
import { TServiceUserPayload } from '@/types/serviceUser';
import { tryCatch } from '@/lib/trycatch';

export const createServiceUserAction = async (payload: TServiceUserPayload) => {
    const [data, error] = await tryCatch('service-users', payload, { method: 'POST' });
    revalidatePath('/');
    return { data, error: error?.message };
};

export const updateServiceUserAction = async (id: string, payload: TServiceUserPayload) => {
    const [data, error] = await tryCatch(`service-users/${id}`, payload, { method: 'PUT' });
    revalidatePath('/');
    return { data, error: error?.message };
};

export const deleteServiceUserAction = async (id: string) => {
    const [data, error] = await tryCatch(`service-users/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/');
    return { data, error: error?.message };
};
