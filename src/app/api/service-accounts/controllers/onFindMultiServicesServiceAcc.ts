import { EXPIRING, ONGOING } from '@/statics';
import { db, errorResponse, successResponse } from '../../helpers';

// find services account by service id and send each services equal data
export const onFindMultiServicesServiceAcc = async (
    query: string | null, // Filter by ongoing or expiring
    page: number, // Page number for pagination
    limit: number, // Number of records per page
    searchQuery: string, // Search string to filter service accounts
) => {
    try {
        // Set condition based on query input
        let whereClause = {};
        const skip = (page - 1) * limit;
        // If query is ONGOING, filter by leftDays greater than or equal to 4
        if (query === ONGOING) {
            whereClause = { leftDays: { gte: 4 } };
        }
        // If query is EXPIRING, filter by leftDays less than or equal to 3
        else if (query === EXPIRING) {
            whereClause = { leftDays: { lte: 3 } };
        }

        // Fetch all services with associated service accounts
        const services = await db.service.findMany({
            select: {
                id: true,
                name: true,
                serviceAccount: {
                    // Filter service accounts by whereClause and searchQuery
                    where: {
                        ...whereClause,
                        email: { contains: searchQuery, mode: 'insensitive' },
                    },
                    // Select only the necessary fields
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
                    // Order by leftDays in ascending order
                    orderBy: { leftDays: 'asc' },
                    // Skip the first (page - 1) * limit records
                    skip,
                    // Take the next limit records
                    take: limit,
                },
                // Get the total count of service accounts for each service
                _count: {
                    select: {
                        serviceAccount: {
                            // Filter by whereClause and searchQuery
                            where: {
                                ...whereClause,
                                email: { contains: searchQuery, mode: 'insensitive' },
                            },
                        },
                    },
                },
            },
        });

        // If no services are found, return an error response
        if (!services || services.length === 0) return errorResponse('No services found', 200);

        // Extract the service IDs and names from the services array
        const allServices = services.map(({ id, name }) => ({
            id,
            name,
        }));

        // Extract the service accounts from the services array
        const serviceAccounts = services.flatMap((service) => service.serviceAccount);

        // Extract the total count of service accounts for each service
        const totalRecords = services.reduce(
            (acc, { id, _count }) => {
                acc[id] = _count.serviceAccount;
                return acc;
            },
            {} as Record<string, number>,
        );

        // Format the response
        const formattedResponse = {
            services: allServices,
            serviceAccounts,
            totalRecords,
        };

        // Return a success response with the formatted response
        return successResponse(formattedResponse, 'ServiceAccounts fetched successfully');
    } catch (error) {
        // Catch any errors and log them to the console
        console.error('Error fetching service accounts:', error);
        // Return an error response with a 500 status code
        return errorResponse('Internal server error', 500);
    }
};
