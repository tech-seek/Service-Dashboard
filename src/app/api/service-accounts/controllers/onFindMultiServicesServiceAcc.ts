import { EXPIRING, ONGOING } from '@/statics';
import { db, errorResponse, successResponse } from '../../helpers';

export const onFindMultiServicesServiceAcc = async (
    query: string | null,
    page: number,
    limit: number,
    searchQuery: string,
) => {
    try {
        let whereClause = {};

        if (query === ONGOING) {
            whereClause = { leftDays: { gte: 4 } };
        } else if (query === EXPIRING) {
            whereClause = { leftDays: { lte: 3 } };
        }

        const services = await db.service.findMany({
            select: {
                id: true,
                name: true,
                serviceAccount: {
                    where: {
                        ...whereClause,
                        email: { contains: searchQuery, mode: 'insensitive' },
                    },
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
                        dealer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        serviceUser: true,
                    },
                    orderBy: { leftDays: 'asc' },
                    skip: (page - 1) * limit,
                    take: limit,
                },
                _count: {
                    select: { serviceAccount: true },
                },
            },
        });

        if (!services.length) return errorResponse('No services found', 200);

        const formattedResponse = {
            serviceAccounts: services.flatMap((service) => service.serviceAccount),
            totalRecords: services.reduce((acc, service) => {
                acc[service.id] = service._count.serviceAccount;
                return acc;
            }, {} as Record<string, number>),
        };

        console.log('🚀 > formattedResponse:', formattedResponse);
        return successResponse(formattedResponse, 'ServiceAccounts fetched successfully');
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
