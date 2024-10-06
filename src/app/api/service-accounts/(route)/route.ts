import { ONGOING } from '@/statics';
import { NextRequest } from 'next/server';
import { TServiceAccountPayload } from '@/types/serviceAccount';
import { errorResponse } from '@/app/api/helpers';
import {
    onCreateServiceAccount,
    onFindAllServiceAccounts,
    onFindMultiServicesServiceAcc,
    onFindServiceAccounts,
} from '../controllers';
import { updateLeftDaysServiceAccounts } from '../controllers/updateLeftDaysServiceAccounts';

// Create a new ServiceAccount
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TServiceAccountPayload;
        return await onCreateServiceAccount(body);
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Fetch all ServiceAccounts with pagination
export const GET = async (req: NextRequest) => {
    try {
        const searchParam = new URLSearchParams(req.nextUrl.searchParams);
        const isUpdateLeftDays = searchParam.get('is-update-left-days');
        const query = searchParam.get('q');
        const all = searchParam.get('all');
        const searchQuery = searchParam.get('search') ?? '';
        const page = parseInt(searchParam.get('page') ?? '1', 10);
        const limit = parseInt(searchParam.get('limit') ?? '30', 10);
        const decodedSearchQuery = decodeURIComponent(searchQuery);
        if (isUpdateLeftDays) {
            const res = await updateLeftDaysServiceAccounts();
            return res;
        } else if (all) {
            return await onFindAllServiceAccounts();
        } else if (query === ONGOING) {
            return await onFindMultiServicesServiceAcc(
                query,
                page,
                limit,
                decodedSearchQuery.trim(),
            );
        } else {
            return await onFindServiceAccounts(query, page, limit, decodedSearchQuery.trim());
        }
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
