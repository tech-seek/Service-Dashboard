import { EXPIRING, ONGOING } from '@/statics';
import { TServiceAccountPayload } from '@/types/serviceAccount';
import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { ServiceAccountSchema } from '../validations';

export const onCreateServiceAccount = async (payload: TServiceAccountPayload) => {
    try {
        const { error } = ServiceAccountSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const existingServiceAccount = await db.serviceAccount.findFirst({
            where: { email: payload.email },
        });

        if (existingServiceAccount) return errorResponse('ServiceAccount already exists', 400);
        // check if email exist
        const emailId = await db.serviceAccount.findUnique({ where: { email: payload.email } });
        if (emailId) return errorResponse('Email already exists', 400);
        //check if service  exist
        const serviceId = await db.service.findUnique({ where: { id: payload.serviceId } });
        if (!serviceId) return errorResponse('Service not found', 404);

        //check if dealer exist
        const dealerId = await db.dealer.findUnique({
            where: { id: payload.dealerId },
        });
        if (!dealerId) return errorResponse('Dealer not found', 404);
        const leftDays = calculateLeftDays(payload.endDate);
        const serviceAccount = await db.serviceAccount.create({
            data: { ...payload, leftDays },
            include: {
                service: true,
                dealer: true,
            },
        });
        return successResponse(serviceAccount, 'ServiceAccount created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

export const onFindAllServiceAccounts = async () => {
    try {
        const serviceAccounts = await db.serviceAccount.findMany({
            orderBy: { leftDays: 'asc' },
            include: {
                serviceUser: true,
                dealer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!serviceAccounts.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(serviceAccounts, 'ServiceAccounts fetched successfully');
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
// find services with pagination and search query
export const onFindServiceAccounts = async (
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
        const serviceAccounts = await db.serviceAccount.findMany({
            where: {
                ...whereClause,
                email: {
                    contains: searchQuery,
                    mode: 'insensitive',
                },
            },
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
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            skip,
            take: limit,
        });

        // Count total records for pagination info
        const totalRecords = await db.serviceAccount.count({ where: whereClause });
        // extract all services
        const services = serviceAccounts.map((service) => service.service);
        if (!serviceAccounts.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(
            { services, serviceAccounts, totalRecords },
            'ServiceAccounts fetched successfully',
        );
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};
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

        // Fetch distinct serviceId values
        const distinctServices = await db.serviceAccount.findMany({
            where: {
                ...whereClause,
                email: { contains: searchQuery, mode: 'insensitive' },
            },
            select: { serviceId: true },
            distinct: ['serviceId'], // Fetch only distinct serviceIds
        });
        // Paginate results for each distinct serviceId
        const formattedServiceData = await Promise.all(
            distinctServices.map(async ({ serviceId }) => {
                // Fetch paginated data for the current serviceId
                const serviceAccounts = await db.serviceAccount.findMany({
                    where: {
                        ...whereClause,
                        email: { contains: searchQuery, mode: 'insensitive' },
                        serviceId,
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
                });

                // Count the total number of records for the current serviceId
                const totalRecords = await db.serviceAccount.count({
                    where: {
                        ...whereClause,
                        serviceId,
                        email: { contains: searchQuery, mode: 'insensitive' },
                    },
                });

                // Return paginated results for the current service
                return {
                    serviceId,
                    totalRecords,
                    serviceAccounts,
                };
            }),
        );

        // Prepare final response
        const formattedResponse = {
            serviceAccounts: formattedServiceData.flatMap((service) => service.serviceAccounts),
            totalRecords: formattedServiceData.reduce(
                (acc, { serviceId, totalRecords }) => {
                    acc[serviceId] = totalRecords;
                    return acc;
                },
                {} as Record<string, number>,
            ),
        };

        if (!formattedServiceData.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(formattedResponse, 'ServiceAccounts fetched successfully');
    } catch (error) {
        console.error('Error fetching service accounts:', error);
        return errorResponse('Internal server error', 500);
    }
};

// single find service account
export const onFindServiceAccount = async (id: string) => {
    try {
        const serviceAccount = await db.serviceAccount.findUnique({ where: { id } });
        if (!serviceAccount) return errorResponse('ServiceAccount not found', 404);

        return successResponse(serviceAccount, 'ServiceAccount fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

export const onUpdateServiceAccount = async (id: string, payload: TServiceAccountPayload) => {
    try {
        const { error } = ServiceAccountSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const existingServiceAccount = await db.serviceAccount.findUnique({ where: { id } });
        if (!existingServiceAccount) return errorResponse('ServiceAccount not found', 404);

        const leftDays = calculateLeftDays(payload.endDate);

        const updatedServiceAccount = await db.serviceAccount.update({
            where: { id },
            data: { ...payload, leftDays },
        });
        return successResponse(updatedServiceAccount, 'ServiceAccount updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

export const onDeleteServiceAccount = async (id: string) => {
    try {
        const existingServiceAccount = await db.serviceAccount.findUnique({ where: { id } });
        if (!existingServiceAccount) return errorResponse('ServiceAccount not found', 404);

        await db.serviceAccount.delete({ where: { id } });
        return successResponse('ServiceAccount deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete ServiceAccount', 500);
    }
};
