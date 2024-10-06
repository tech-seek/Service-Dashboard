import { NextRequest } from 'next/server';
import { errorResponse } from '../../helpers';
import { onFindServiceUsersExpiring } from '../controllers';


export const GET = async (req: NextRequest) => {
    try {
        const searchParam = new URLSearchParams(req.nextUrl.searchParams);
        const searchQuery = searchParam.get('search') ?? '';
        const page = parseInt(searchParam.get('page') ?? '1', 10);
        const limit = parseInt(searchParam.get('limit') ?? '10', 10);
        const decodedSearchQuery = decodeURIComponent(searchQuery);
        return await onFindServiceUsersExpiring(page, limit, decodedSearchQuery.trim());
    } catch (err) {
        return errorResponse('Internal server error');
    }
};