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
            include: {
                serviceUser: true,
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

        // Count total records for pagination info
        const totalRecords = await db.serviceAccount.count({ where: whereClause });

        if (!serviceAccounts.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }

        return successResponse(
            { serviceAccounts, totalRecords },
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

        // Fetch distinct services
        const distinctServices = await db.serviceAccount.findMany({
            where: whereClause,
            select: {
                serviceId: true,
            },
            distinct: ['serviceId'],
        });

        const formattedServiceData = await Promise.all(
            distinctServices.map(async (service) => {
                // Fetch paginated data for the service
                const serviceAccounts = await db.serviceAccount.findMany({
                    where: {
                        ...whereClause,
                        email: {
                            contains: searchQuery,mode: 'insensitive' 
                        },
                        serviceId: service.serviceId,
                    },
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
                    skip: (page - 1) * limit,
                    take: limit,
                });

                // Count total records for this particular service
                const totalRecords = await db.serviceAccount.count({
                    where: {
                        ...whereClause,
                        serviceId: service.serviceId,
                    },
                });

                return {
                    serviceId: service.serviceId,
                    totalRecords,
                    serviceAccounts,
                };
            }),
        );
        // Create an object with serviceId as key and totalRecords as value
        const totalRecordsByServiceId = formattedServiceData.reduce(
            (acc, service) => {
                acc[service.serviceId] = service.totalRecords;
                return acc;
            },
            {} as Record<string, number>,
        );
        // Flatten the result if needed
        if (!formattedServiceData.length) {
            return errorResponse('No ServiceAccounts found', 404);
        }
        const formatedResponse = {
            serviceAccounts: formattedServiceData.flatMap((service) => service.serviceAccounts),
            totalRecords: totalRecordsByServiceId,
        };
        return successResponse(formatedResponse, 'ServiceAccounts fetched successfully');
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
