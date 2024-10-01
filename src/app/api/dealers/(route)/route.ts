import { NextRequest } from 'next/server';
import { TDealerPayload } from '@/types/dealer';
import { errorResponse } from '@/app/api/helpers';
import { onCreateDealer, onFindDealers } from '../controllers';

// Create Dealer
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TDealerPayload;
        const res = await onCreateDealer(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Get All Dealers
export const GET = async () => {
    try {
        const res = await onFindDealers();
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
