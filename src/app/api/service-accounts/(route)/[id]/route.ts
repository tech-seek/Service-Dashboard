import { NextRequest } from 'next/server';
import { TServiceAccountPayload } from '@/types/serviceAccount';
import { errorResponse } from '@/app/api/helpers';
import {
    onDeleteServiceAccount,
    onFindServiceAccount,
    onUpdateServiceAccount,
} from '../../controllers';

// Get a single ServiceAccount by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        return await onFindServiceAccount(params.id);
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update a ServiceAccount by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const body = (await req.json()) as TServiceAccountPayload;
        return await onUpdateServiceAccount(params.id, body);
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete a ServiceAccount by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        return await onDeleteServiceAccount(params.id);
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
