'use server';

import { revalidatePath } from 'next/cache';
import { tryCatch } from '@/lib/trycatch';


export const deleteHistoryActions = async (id: string) => {
    const [data, error] = await tryCatch(`histories/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/dashboard/history');
    return { data, error: error?.message };
};