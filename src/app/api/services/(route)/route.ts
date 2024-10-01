import { NextRequest } from 'next/server';
import { TServicePayload } from '@/types/service';
import { errorResponse } from '@/app/api/helpers';
import { onCreateService, onFindServices } from '../controllers';

export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TServicePayload;
        const res = await onCreateService(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

export const GET = async () => {
    try {
        const res = await onFindServices();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
