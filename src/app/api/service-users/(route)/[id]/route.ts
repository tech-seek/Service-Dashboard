import { NextRequest } from 'next/server';
import { TServiceUserPayload } from '@/types/serviceUser';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteServiceUser, onFindServiceUser, onUpdateServiceUser } from '../../controllers';

// Get Service User by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const res = await onFindServiceUser(id);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update Service User by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const body = (await req.json()) as TServiceUserPayload;
        const res = await onUpdateServiceUser(id, body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete Service User by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const res = await onDeleteServiceUser(id);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
