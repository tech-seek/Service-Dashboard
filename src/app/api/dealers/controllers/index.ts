import { TDealerPayload } from '@/types/dealer';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { DealerSchema } from '../validations';

// Create a new dealer
export const onCreateDealer = async (payload: TDealerPayload) => {
    try {
        const { error } = DealerSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const isDealerExisting = await db.dealer.findFirst({
            where: { name: payload.name },
        });
        if (isDealerExisting) return errorResponse('Dealer already exists', 400);

        const dealer = await db.dealer.create({
            data: payload,
        });
        return successResponse(dealer, 'Dealer created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Get all dealers
export const onFindDealers = async () => {
    try {
        const dealers = await db.dealer.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        return successResponse(dealers, 'Dealers fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Get a dealer by ID
export const onFindDealer = async (id: string) => {
    try {
        const dealer = await db.dealer.findUnique({ where: { id } });
        if (!dealer) return errorResponse('Dealer not found', 404);

        return successResponse(dealer, 'Dealer fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update a dealer
export const onUpdateDealer = async (id: string, payload: TDealerPayload) => {
    try {
        const { error } = DealerSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const dealer = await db.dealer.update({ where: { id }, data: payload });
        return successResponse(dealer, 'Dealer updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete a dealer
export const onDeleteDealer = async (id: string) => {
    try {
        const dealer = await db.dealer.findUnique({ where: { id } });
        if (!dealer) return errorResponse('Dealer not found', 404);

        await db.dealer.delete({ where: { id } });
        return successResponse('Dealer deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete dealer', 500);
    }
};
