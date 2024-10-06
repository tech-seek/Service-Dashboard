import { TTaskPayload } from '@/types/task';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TaskSchema } from '../validations';

// Create a new Task
export const onCreateTask = async (payload: TTaskPayload) => {
    try {
        const { error } = TaskSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);
        const serviceId = await db.service.findUnique({ where: { id: payload.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);
        const serviceAccountId = await db.serviceAccount.findUnique({
            where: { id: payload.serviceAccountId },
        });
        if (!serviceAccountId) return errorResponse('Service account not found', 404);
        const task = await db.task.create({
            data: payload,
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!task) return errorResponse('Task creation failed', 404);

        return successResponse(task, 'Task created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all Tasks
export const onFindTasks = async () => {
    try {
        const tasks = await db.task.findMany({
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!tasks || tasks.length === 0) return errorResponse('No tasks found', 200);

        return successResponse(tasks, 'Tasks fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find a Task by ID
export const onFindTask = async (id: string) => {
    try {
        const task = await db.task.findUnique({ where: { id } });

        if (!task) return errorResponse('Task not found', 404);

        return successResponse(task, 'Task fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update a Task by ID
export const onUpdateTask = async (id: string, payload: TTaskPayload) => {
    try {
        const { error } = TaskSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const existingTask = await db.task.findUnique({ where: { id } });
        if (!existingTask) return errorResponse('Task not found', 404);

        const serviceId = await db.service.findUnique({ where: { id: payload.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);

        const serviceAccountId = await db.serviceAccount.findUnique({
            where: { id: payload.serviceAccountId },
        });
        if (!serviceAccountId) return errorResponse('Service account not found', 404);

        const task = await db.task.update({
            where: { id },
            data: payload,
        });

        if (!task) return errorResponse('Task update failed', 404);

        return successResponse(task, 'Task updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete a Task by ID
export const onDeleteTask = async (id: string) => {
    try {
        const existingTask = await db.task.findUnique({ where: { id } });
        if (!existingTask) return errorResponse('Task not found', 404);

        await db.task.delete({ where: { id } });
        return successResponse('Task deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete task', 500);
    }
};
