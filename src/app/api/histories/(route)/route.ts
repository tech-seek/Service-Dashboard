import { NextRequest } from 'next/server';
import { THistoryPayload } from '@/types/history';
import { errorResponse } from '@/app/api/helpers';
import { onCreateHistory, onFindHistories } from '../controllers';

// Create a new history record
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as THistoryPayload;

        const res = await onCreateHistory(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Fetch all history records
export const GET = async (req: NextRequest) => {
    try {
        const searchParam = new URLSearchParams(req.nextUrl.searchParams);
        const page = parseInt(searchParam.get('page') ?? '1', 10);
        const limit = parseInt(searchParam.get('limit') ?? '10', 10);
        const searchQuery = searchParam.get('search') ?? '';
        const decodedSearchQuery = decodeURIComponent(searchQuery);
        const res = await onFindHistories(page, limit, decodedSearchQuery.trim());
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
