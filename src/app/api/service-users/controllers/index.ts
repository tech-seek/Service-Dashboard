import { EXPIRING, ONGOING } from '@/statics';
import { format } from 'date-fns';
import { THistoryPayload } from '@/types/history';
import { TServiceUserPayload } from '@/types/serviceUser';
import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { ServiceUserSchema } from '../validations';

// Create a new service user
export const onCreateServiceUser = async (payload: TServiceUserPayload) => {
    try {
        const { error } = ServiceUserSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);
        // check if serviceId valid
        const serviceId = await db.service.findUnique({ where: { id: payload.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);
        // check if serviceAccountId valid
        const serviceAccountId = await db.serviceAccount.findUnique({
            where: { id: payload.serviceAccountId },
        });
        if (!serviceAccountId) return errorResponse('Service account not found', 404);
        // Calculate left days
        const leftDays = calculateLeftDays(payload.endDate);
        const serviceUser = await db.serviceUser.create({
            data: { ...payload, leftDays },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        userName: true,
                        role: true,
                    },
                },
            },
        });
        return successResponse(serviceUser, 'Service user created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Get all service users
export const onFindAllServiceUsers = async () => {
    try {
        const serviceUsers = await db.serviceUser.findMany({
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        userName: true,
                        role: true,
                    },
                },
            },
        });
        return successResponse(serviceUsers, 'Service users fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};
// find services with pagination and search query
export const onFindServiceUsers = async (
    query: string | null,
    page: number,
    limit: number,
    searchQuery: string,
) => {
    try {
        let whereClause = {};

        switch (query) {
            case ONGOING:
                whereClause = { leftDays: { gte: 4 } };
                break;
            case EXPIRING:
                whereClause = { leftDays: { lte: 3 } };
                break;
            default:
                break;
        }

        // Calculate skip based on current page and page size
        const skip = (page - 1) * limit;

        // Fetch data with pagination
        const serviceUsers = await db.serviceUser.findMany({
            where: {
                ...whereClause,
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { phone: { contains: searchQuery, mode: 'insensitive' } },
                    { email: { contains: searchQuery, mode: 'insensitive' } },
                    { service: { name: { contains: searchQuery, mode: 'insensitive' } } },
                ],
            },
            orderBy: { leftDays: 'asc' },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,                
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        userName: true,
                        role: true,
                    },
                },
            },
            skip,
            take: limit,
        });

        // Count total records for pagination info
        const totalRecords = await db.serviceUser.count({ where: whereClause });

        if (!serviceUsers.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(
            { serviceUsers, totalRecords },
            'ServiceAccounts fetched successfully',
        );
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
// find services with pagination and search query
export const onFindServiceUsersOnGoing = async (
    page: number,
    limit: number,
    searchQuery: string,
) => {
    try {
        // Calculate skip based on current page and page size
        const skip = (page - 1) * limit;

        // Fetch data with pagination
        const serviceUsers = await db.serviceUser.findMany({
            where: {
                leftDays: { gte: 4 },
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { phone: { contains: searchQuery, mode: 'insensitive' } },
                    { email: { contains: searchQuery, mode: 'insensitive' } },
                    { service: { name: { contains: searchQuery, mode: 'insensitive' } } },
                ],
            },
            orderBy: { leftDays: 'asc' },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        userName: true,
                        role: true,
                    },
                },
            },
            skip,
            take: limit,
        });

        // Count total records for pagination info
        const totalRecords = await db.serviceUser.count({ where: { leftDays: { gte: 4 } } });

        if (!serviceUsers.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(
            { serviceUsers, totalRecords },
            'ServiceAccounts fetched successfully',
        );
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
// find services with pagination and search query expiring only
export const onFindServiceUsersExpiring = async (
    page: number,
    limit: number,
    searchQuery: string,
) => {
    try {
        // Calculate skip based on current page and page size
        const skip = (page - 1) * limit;
        console.log(searchQuery, 'inside index');
        // Fetch data with pagination
        const serviceUsers = await db.serviceUser.findMany({
            where: {
                leftDays: { lte: 3 },
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    {
                        phone: {
                            contains: searchQuery,
                            mode: 'insensitive',
                        },
                    },
                    { email: { contains: searchQuery, mode: 'insensitive' } },
                    { service: { name: { contains: searchQuery, mode: 'insensitive' } } },
                ],
            },
            orderBy: { leftDays: 'asc' },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceAccount: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        userName: true,
                        role: true,
                    },
                },
            },
            skip,
            take: limit,
        });

        // Count total records for pagination info
        const totalRecords = await db.serviceUser.count({ where: { leftDays: { lte: 3 } } });

        if (!serviceUsers.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(
            { serviceUsers, totalRecords },
            'ServiceAccounts fetched successfully',
        );
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};

// export const onFindMultiServicesServiceUsers = async (
//     query: string | null,
//     page: number,
//     limit: number,
//     searchQuery: string,
// ) => {
//     try {
//         let whereClause = {};

//         switch (query) {
//             case ONGOING:
//                 whereClause = { leftDays: { gte: 4 } };
//                 break;
//             case EXPIRING:
//                 whereClause = { leftDays: { lte: 3 } };
//                 break;
//             default:
//                 break;
//         }

//         // Fetch distinct services
//         const distinctServices = await db.serviceUser.findMany({
//             where: whereClause,
//             select: {
//                 serviceId: true,
//             },
//             distinct: ['serviceId'],
//         });

//         const formattedServiceData = await Promise.all(
//             distinctServices.map(async (service) => {
//                 // Fetch paginated data for the service
//                 const serviceUsers = await db.serviceUser.findMany({
//                     where: {
//                         ...whereClause,
//                         OR: [
//                             { name: { contains: searchQuery } },
//                             { phone: { contains: searchQuery } },
//                             { email: { contains: searchQuery } },
//                             {service:{name:{contains:searchQuery}}},
//                         ],
//                         serviceId: service.serviceId,
//                     },
//                     include: {
//                         service: {
//                             select: {
//                                 id: true,
//                                 name: true,
//                             },
//                         },
//                         serviceAccount: {
//                             select: {
//                                 id: true,
//                                 email: true,
//                             },
//                         },
//                         provider: {
//                             select: {
//                                 id: true,
//                                 userName: true,
//                                 role: true,
//                             },
//                         },
//                     },
//                     skip: (page - 1) * limit,
//                     take: limit,
//                 });

//                 // Count total records for this particular service
//                 const totalRecords = await db.serviceUser.count({
//                     where: whereClause,
//                 });

//                 return {
//                     serviceId: service.serviceId,
//                     totalRecords,
//                     serviceUsers,
//                 };
//             }),
//         );

//         if (!formattedServiceData.length) {
//             return errorResponse('No Service Users found', 404);
//         }

//         const formattedResponse = {
//             serviceUsers: formattedServiceData.flatMap((service) => service.serviceUsers),
//             totalRecords: formattedServiceData.flatMap((service) => service.totalRecords),
//         };

//         return successResponse(formattedResponse, 'Service Users fetched successfully');
//     } catch (error) {
//         console.error('Error fetching service users:', error);
//         return errorResponse('Internal server error', 500);
//     }
// };

// Get a service user by ID

export const onFindServiceUser = async (id: string) => {
    try {
        const serviceUser = await db.serviceUser.findUnique({ where: { id } });
        if (!serviceUser) return errorResponse('Service user not found', 404);

        return successResponse(serviceUser, 'Service user fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update a service user
export const onUpdateServiceUser = async (id: string, payload: TServiceUserPayload) => {
    try {
        const { error } = ServiceUserSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // check if serviceAccountId valid
        const serviceAccountId = await db.serviceAccount.findUnique({
            where: { id: payload.serviceAccountId },
        });
        if (!serviceAccountId) return errorResponse('Service account not found', 404);

        const leftDays = calculateLeftDays(payload.endDate);
        const serviceUser = await db.serviceUser.update({
            where: { id },
            data: { ...payload, leftDays },
        });

        return successResponse(serviceUser, 'Service user updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete a service user
export const onDeleteServiceUser = async (id: string) => {
    try {
        const serviceUser = await db.serviceUser.findUnique({ where: { id } });
        if (!serviceUser) return errorResponse('Service user not found', 404);
        await db.$transaction(async (prisma) => {
            const provider = await prisma.user.findUnique({
                where: { userName: serviceUser.providerName },
            });
            const historyData: THistoryPayload = {
                name: serviceUser.name,
                phone: serviceUser.phone,
                serviceId: serviceUser.serviceId,
                providerId: provider?.id ?? '',
                lastExpire: format(serviceUser.endDate, 'dd MMM yyyy'),
            };
            await prisma.history.create({ data: historyData });
            await prisma.serviceUser.delete({ where: { id } });
        });
        return successResponse('Service user deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete service user', 500);
    }
};
