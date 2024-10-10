import { NextRequest } from 'next/server';
import { TServiceUserPayload } from '@/types/serviceUser';
import { errorResponse } from '@/app/api/helpers';
import { onCreateServiceUser, onFindAllServiceUsers, onFindServiceUsers } from '../controllers';
import { updateLeftDays } from '../controllers/updateLeftDaysServiceUsers';

// Create Service User
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TServiceUserPayload;
        const res = await onCreateServiceUser(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Get All Service Users
export const GET = async (req: NextRequest) => {
    try {
        const searchParam = new URLSearchParams(req.nextUrl.searchParams);
        const isUpdateLeftDays = searchParam.get('is-update-left-days');
        const query = searchParam.get('q');
        const all = searchParam.get('all');
        const searchQuery = searchParam.get('search') ?? '';
        const page = parseInt(searchParam.get('page') ?? '1', 10);
        const limit = parseInt(searchParam.get('limit') ?? '10', 10);

        if (isUpdateLeftDays) {
            const res = await updateLeftDays();
            return res;
        } else if (all) {
            return await onFindAllServiceUsers();
        } else {
            return await onFindServiceUsers(query, page, limit, searchQuery);
        }
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
