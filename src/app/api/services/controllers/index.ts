import { TServicePayload } from '@/types/service';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { ServiceSchema } from '../validations';

export const onCreateService = async (payload: TServicePayload) => {
    try {
        const { error } = ServiceSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const isServiceExisting = await db.service.findFirst({
            where: { name: payload.name },
        });

        if (isServiceExisting) return errorResponse('Service already exists', 400);

        const service = await db.service.create({ data: payload });
        if (!service) return errorResponse('Service creation failed', 404);

        return successResponse(service, 'Service created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all services
export const onFindServices = async () => {
    try {
        const services = await db.service.findMany({
            select:{
                id: true,
                name: true,
            }
        });
        if (!services || services.length === 0) return errorResponse('No services found', 200);

        return successResponse(services, 'Services fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find a service
export const onFindService = async (id: string) => {
    try {
        const service = await db.service.findUnique({ where: { id } });
        if (!service) return errorResponse('Service not found', 404);

        return successResponse(service, 'Service fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update a service
export const onUpdateService = async (id: string, payload: TServicePayload) => {
    try {
        const { error } = ServiceSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const existingService = await db.service.findUnique({
            where: { id },
        });
        
        if (!existingService) {
            return errorResponse('Service not found', 404);
        }

        const service = await db.service.update({
            where: { id },
            data: payload,
        });
        if (!service) return errorResponse('Service update failed', 404);

        return successResponse(service, 'Service updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete a service
export const onDeleteService = async (id: string) => {
    try {
        const existingService = await db.service.findUnique({
            where: { id },
        });
        if (!existingService) return errorResponse('Service not found', 404);

        await db.service.delete({ where: { id } });
        return successResponse('Service deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete service', 500,error);
    }
};
