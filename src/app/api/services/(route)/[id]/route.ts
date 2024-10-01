import { NextRequest } from 'next/server';
import { TServicePayload } from '@/types/service';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteService, onFindService, onUpdateService } from '../../controllers';

// Get service by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const service = await onFindService(id);
        return service;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update service data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const data = (await req.json()) as TServicePayload;
        const updatedService = await onUpdateService(id, data);
        return updatedService;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete service by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const deletedService = await onDeleteService(id);
        return deletedService;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
