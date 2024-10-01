import { NextRequest } from 'next/server';
import { TDealerPayload } from '@/types/dealer';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteDealer, onFindDealer, onUpdateDealer } from '../../controllers';

// Get Dealer by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const res = await onFindDealer(id);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update Dealer by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const body = (await req.json()) as TDealerPayload;
        const res = await onUpdateDealer(id, body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete Dealer by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const res = await onDeleteDealer(id);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
