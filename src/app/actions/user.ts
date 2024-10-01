'use server';

import { revalidatePath } from 'next/cache';
import { TUserPayload } from '@/types/user';
import { tryCatch } from '@/lib/trycatch';


export const createUserAction = async (payload: TUserPayload) => {
    const [data, error] = await tryCatch(`users`, payload, { method: 'POST' });
     revalidatePath('/dashboard/add-moderator');
    return { data, error: error?.message };
}
export const editUserAction = async (id: string, payload: TUserPayload) => {
    const [data, error] = await tryCatch(`users/${id}`, payload, { method: 'PUT' });
     revalidatePath('/dashboard/add-moderator');
    return { data, error: error?.message };
}

export const deleteUserAction = async (id: string) => {
    const [data, error] = await tryCatch(`users/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/dashboard/add-moderator');
    return { data, error: error?.message };
};