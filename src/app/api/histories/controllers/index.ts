import { THistoryPayload } from '@/types/history';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { HistorySchema } from '../validations';

// Create a history record
export const onCreateHistory = async (payload: THistoryPayload) => {
    try {
        const { error } = HistorySchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const serviceId = await db.service.findUnique({ where: { id: payload.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);

        const history = await db.history.create({
            data: payload,
            include: {
                services: true,
            },
        });
        if (!history) return errorResponse('Failed to create history record', 404);

        return successResponse(history, 'History record created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Fetch all history records
export const onFindHistories = async (page: number, limit: number, searchQuery: string) => {
    try {
        // Calculate skip based on current page and page size
        const skip = (page - 1) * limit;
        const histories = await db.history.findMany({
            where: {
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { phone: { contains: searchQuery, mode: 'insensitive' } },
                    { services: { name: { contains: searchQuery, mode: 'insensitive' } } },
                    { providers: { userName: { contains: searchQuery, mode: 'insensitive' } } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                services: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                providers: {
                    select: {
                        id: true,
                        userName: true,
                    },
                },
            },
            skip,
            take: limit,
        });
              // Count total records for pagination info
        const totalRecords = await db.history.count();
        if (!histories || histories.length === 0)
            return errorResponse('No history records found', 200);

        return successResponse({histories, totalRecords}, 'History records fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Fetch a history record by ID
export const onFindHistory = async (id: string) => {
    try {
        const history = await db.history.findUnique({ where: { id } });
        if (!history) return errorResponse('History record not found', 404);

        return successResponse(history, 'History record fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update a history record by ID
export const onUpdateHistory = async (id: string, payload: THistoryPayload) => {
    try {
        const { error } = HistorySchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const serviceId = await db.service.findUnique({ where: { id: payload.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);

        const updatedHistory = await db.history.update({
            where: { id },
            data: payload,
        });
        if (!updatedHistory) return errorResponse('History record not found', 404);

        return successResponse(updatedHistory, 'History record updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete a history record by ID
export const onDeleteHistory = async (id: string) => {
    try {
        const existingHistory = await db.history.findUnique({ where: { id } });
        if (!existingHistory) return errorResponse('History record not found', 404);

        const serviceId = await db.service.findUnique({ where: { id: existingHistory.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);

        await db.history.delete({ where: { id } });
        return successResponse('History record deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete history record', 500);
    }
};
