import { Prisma } from '@prisma/client';
import { db, errorResponse, successResponse } from '../../helpers';

export const onFindExpiringServiceAccounts = async (
    page: number,
    limit: number,
    searchQuery: string,
) => {
    try {
        const whereClause: Prisma.ServiceAccountWhereInput = {
            leftDays: { lte: 3 }, // Filter for expiring accounts
        };

        if (searchQuery) {
            whereClause.email = {
                contains: searchQuery,
                mode: 'insensitive',
            };
        }

        const skip = (page - 1) * limit;

        const serviceAccounts = await db.serviceAccount.findMany({
            where: whereClause,
            orderBy: { leftDays: 'asc' },
            select: {
                id: true,
                password: true,
                email: true,
                number: true,
                joinDate: true,
                endDate: true,
                leftDays: true,
                status: true,
                updatedAt: true,
                serviceId: true,
                serviceUser: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        endDate: true,
                        type: true,
                        model: true,
                    },
                },
                dealer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            skip,
            take: limit,
        });

        const totalRecords = await db.serviceAccount.count({ where: whereClause });
        const services = await db.service.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        if (!serviceAccounts.length) {
            return errorResponse('No expiring ServiceAccounts found', 404); // More specific message
        }

        return successResponse(
            { services, serviceAccounts, totalRecords },
            'Expiring ServiceAccounts fetched successfully', // More specific message
        );
    } catch (error) {
        console.error('Error fetching expiring service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
