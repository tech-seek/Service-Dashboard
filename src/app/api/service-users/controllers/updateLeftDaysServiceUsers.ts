import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse } from '../../helpers';

const BATCH_SIZE = 100; // Adjust the batch size according to your database's capability

// Helper function to update left days for a batch of records
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateBatch = async (batch: any[]) => {
    const updatePromises = batch.map(async (record) => {
        const endDate = record?.endDate.toISOString() ?? '';
        const leftDays = calculateLeftDays(endDate);
        if (leftDays >= 0) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await db.serviceUser.update({
                    where: { id: record.id },
                    data: { leftDays },
                });
                return 1; // Return 1 for successful updates
            } catch (error) {
                console.error(`Error updating service user ${record.id}:`, error);
                return 0; // Return 0 for failed updates
            }
        }
        return 0;
    });

    const results = await Promise.all(updatePromises);
    return results.reduce((sum: number, val) => sum + val, 0);
};

// Function to update left days for service users
const updateServiceUsersLeftDays = async () => {
    try {
        const serviceUsers = await db.serviceUser.findMany({ select: { id: true, endDate: true } });
        let updatedServiceUsersCount = 0;

        // Process service users in batches
        for (let i = 0; i < serviceUsers.length; i += BATCH_SIZE) {
            const batch = serviceUsers.slice(i, i + BATCH_SIZE);
            updatedServiceUsersCount += await updateBatch(batch);
        }

        return updatedServiceUsersCount;
    } catch (error) {
        console.error('Failed to update left days for service users:', error);
        throw new Error('Failed to update left days for service users');
    }
};

// Main function to update left days for both service users and service accounts
export const updateLeftDays = async () => {
    try {
        const [updatedServiceUsersCount] = await Promise.all([updateServiceUsersLeftDays()]);

        return successResponse(`Updated left days for ${updatedServiceUsersCount} service users`);
    } catch (error) {
        console.error('Failed to update left days:', error);
        return errorResponse('Failed to update left days for service accounts or users', 500);
    }
};
