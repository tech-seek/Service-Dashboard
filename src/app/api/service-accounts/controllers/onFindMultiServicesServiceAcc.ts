import { EXPIRING, ONGOING } from '@/statics';
import { db, errorResponse, successResponse } from '../../helpers';

// find services account by service id and send each services equal data
export const onFindMultiServicesServiceAcc = async (
    query: string | null,
    page: number,
    limit: number,
    searchQuery: string,
) => {
    try {
        let whereClause = {};

        // Set condition based on query input
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
                        serviceUser: true, // Include only if necessary
                    },
                    orderBy: { leftDays: 'asc' },
                    skip: (page - 1) * limit, // Paginate results per serviceId
                    take: limit,
                },
                _count: {
                    select: {
                        serviceAccount: {
                            where: {
                                ...whereClause,
                                email: { contains: searchQuery, mode: 'insensitive' },
                            },
                        },
                    },
                },
            },
        });

        if (!services || services.length === 0) return errorResponse('No services found', 200);

        const formattedResponse = {
            serviceAccounts: services.flatMap((service) => service.serviceAccount),
            totalRecords: services.reduce(
                (acc, { id, _count }) => {
                    acc[id] = _count.serviceAccount;
                    return acc;
                },
                {} as Record<string, number>,
            ),
        };
        return successResponse(formattedResponse, 'ServiceAccounts fetched successfully');
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
