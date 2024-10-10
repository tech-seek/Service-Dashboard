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
                await db.serviceAccount.update({
                    where: { id: record.id },
                    data: { leftDays },
                });
                return 1; // Return 1 for successful updates
            } catch (error) {
                console.error(`Error updating service account ${record.id}:`, error);
                return 0; // Return 0 for failed updates
            }
        }
        return 0;
    });

    const results = await Promise.all(updatePromises);
    return results.reduce((sum: number, val) => sum + val, 0);
};

// Function to update left days for service accounts
const updateServiceAccountsLeftDays = async () => {
    try {
        const serviceAccounts = await db.serviceAccount.findMany({
            select: { id: true, endDate: true },
        });
        let updatedServiceAccountsCount = 0;

        // Process service accounts in batches
        for (let i = 0; i < serviceAccounts.length; i += BATCH_SIZE) {
            const batch = serviceAccounts.slice(i, i + BATCH_SIZE);
            updatedServiceAccountsCount += await updateBatch(batch);
        }

        return updatedServiceAccountsCount;
    } catch (error) {
        console.error('Failed to update left days for service accounts:', error);
        throw new Error('Failed to update left days for service accounts');
    }
};

// Main function to update left days for both service users and service accounts
export const updateLeftDays = async () => {
    try {
        const [updatedServiceAccountsCount] = await Promise.all([updateServiceAccountsLeftDays()]);

        return successResponse(
            `Updated left days for ${updatedServiceAccountsCount} service accounts`,
        );
    } catch (error) {
        console.error('Failed to update left days:', error);
        return errorResponse('Failed to update left days for service accounts or users', 500);
    }
};
