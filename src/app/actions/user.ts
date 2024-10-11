'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { TUserPayload } from '@/types/user';
import { tryCatch } from '@/lib/trycatch';
import { db } from '../api/helpers';

export const createUserAction = async (payload: TUserPayload) => {
    const [data, error] = await tryCatch(`users`, payload, { method: 'POST' });
    revalidatePath('/dashboard/add-moderator');
    return { data, error: error?.message };
};
export const editUserAction = async (id: string, payload: TUserPayload) => {
    const [data, error] = await tryCatch(`users/${id}`, payload, { method: 'PUT' });
    revalidatePath('/dashboard/add-moderator');
    return { data, error: error?.message };
};

export const deleteUserAction = async (id: string) => {
    const [data, error] = await tryCatch(`users/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/dashboard/add-moderator');
    return { data, error: error?.message };
};

export const getUserByNameAction = cache(async (name: string) => {
    const user = await db.user.findUnique({ where: { userName: name } });
    return user;
});

export const isAdminAction = cache(async () => {
    const session = await auth();
    const user = await getUserByNameAction(session?.user?.name ?? '');
    const isAdmin = user?.role === 'admin';
    return isAdmin;
});
