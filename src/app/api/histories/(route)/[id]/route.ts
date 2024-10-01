import { NextRequest } from 'next/server';
import { THistoryPayload } from '@/types/history';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteHistory, onFindHistory, onUpdateHistory } from '../../controllers';

// Get a history record by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const history = await onFindHistory(id);
        return history;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update a history record by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const data = (await req.json()) as THistoryPayload;
        const updatedHistory = await onUpdateHistory(id, data);
        return updatedHistory;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete a history record by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const deletedHistory = await onDeleteHistory(id);
        return deletedHistory;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
