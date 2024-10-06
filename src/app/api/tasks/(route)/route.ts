import { NextRequest } from 'next/server';
import { TTaskPayload } from '@/types/task';
import { db, errorResponse, successResponse } from '@/app/api/helpers';
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
export const GET = async (req: NextRequest) => {
    try {
        const searchParams = new URLSearchParams(req.nextUrl.searchParams);
        const pendingTaskCount = searchParams.get('pending-task-count') ?? '';
        if (pendingTaskCount) {
            const pendingTask = await db.task.count({ where: { status: 'pending' } });
            return successResponse(pendingTask, 'Tasks fetched successfully');
        } else {
            const res = await onFindTasks();
            return res;
        }
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
