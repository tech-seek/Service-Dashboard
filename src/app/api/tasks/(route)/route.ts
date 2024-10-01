import { NextRequest } from 'next/server';
import { TTaskPayload } from '@/types/task';
import { errorResponse } from '@/app/api/helpers';
import { onCreateTask, onFindTasks } from '../controllers';

// Create a new Task
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TTaskPayload;
        const res = await onCreateTask(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Get all Tasks
export const GET = async () => {
    try {
        const res = await onFindTasks();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
