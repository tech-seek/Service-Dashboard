import { NextRequest } from 'next/server';
import { TTaskPayload } from '@/types/task';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteTask, onFindTask, onUpdateTask } from '../../controllers';

// Get Task by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const task = await onFindTask(id);
        return task;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update Task by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const data = (await req.json()) as TTaskPayload;
        const updatedTask = await onUpdateTask(id, data);
        return updatedTask;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete Task by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const deletedTask = await onDeleteTask(id);
        return deletedTask;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
