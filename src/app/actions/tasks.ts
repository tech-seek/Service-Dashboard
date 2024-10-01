'use server';

import { revalidatePath } from 'next/cache';
import { tryCatch } from '@/lib/trycatch';
import { TTaskPayload, TTaskResponse } from '@/types/task';


export const createTasksAction = async (payload: TTaskPayload) => {
    const [res, error] = await tryCatch('tasks', payload, { method: 'POST' });
    revalidatePath('/');
    return { data: (res as { data: TTaskResponse }).data, error: error?.message };
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