'use server';

import { revalidatePath } from 'next/cache';
import { TTaskPayload } from '@/types/task';
import { tryCatch } from '@/lib/trycatch';

export const createTasksAction = async (payload: TTaskPayload) => {
    console.log('🚀 > file: tasks.ts:9 > createTasksAction > payload:', payload);
    const [data, error] = await tryCatch('tasks', payload, { method: 'POST' });
    revalidatePath('/');
    return { data, error: error?.message };
};

export const updateTaskAction = async (id: string, payload: TTaskPayload) => {
    const [data, error] = await tryCatch(`tasks/${id}`, payload, { method: 'PUT' });
    revalidatePath('/');
    return { data, error: error?.message };
};

export const deleteTaskAction = async (id: string) => {
    const [data, error] = await tryCatch(`tasks/${id}`, {}, { method: 'DELETE' });
    revalidatePath('/');
    return { data, error: error?.message };
};
