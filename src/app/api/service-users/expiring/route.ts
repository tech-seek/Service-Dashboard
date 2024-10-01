import { NextRequest } from 'next/server';
import { errorResponse } from '../../helpers';
import { onFindServiceUsersExpiring } from '../controllers';

export const GET = async (req: NextRequest) => {
    try {
        const searchParam = new URLSearchParams(req.nextUrl.searchParams);
        const searchQuery = searchParam.get('search') ?? '';
        const page = parseInt(searchParam.get('page') ?? '1', 10);
        const limit = parseInt(searchParam.get('limit') ?? '10', 10);
        return await onFindServiceUsersExpiring(page, limit, searchQuery);
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
