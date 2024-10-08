import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse } from '../helpers';


const BATCH_SIZE = 50; // Adjust the batch size according to your database's capability

// Utility function to update left days for both service users and service accounts
export const updateLeftDays = async () => {
    try {
        // Fetch service accounts and service users
        const [serviceAccounts, serviceUsers] = await Promise.all([
            db.serviceAccount.findMany({ select: { id: true, endDate: true } }),
            db.serviceUser.findMany({ select: { id: true, endDate: true } }),
        ]);

        let updatedServiceAccountsCount = 0;
        let updatedServiceUsersCount = 0;

        // Helper function to update left days for a batch of records
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateBatch = async (batch:any[], isAccount: boolean) => {
            const updatePromises = batch.map(async (record) => {
                const endDate = record?.endDate.toISOString() ?? '';
                const leftDays = calculateLeftDays(endDate);
                if (leftDays >= 0) {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (db[isAccount ? 'serviceAccount' : 'serviceUser'] as any).update({
                            where: { id: record.id },
                            data: { leftDays },
                        });
                        return 1; // Return 1 for successful updates
                    } catch (error) {
                        console.error(
                            `Error updating ${isAccount ? 'account' : 'user'} ${record.id}:`,
                            error,
                        );
                        return 0; // Return 0 for failed updates
                    }
                }
                return 0;
            });

            const results = await Promise.all(updatePromises);
            return results.reduce((sum: number, val) => sum + val, 0);
        };

        // Process service accounts in batches
        for (let i = 0; i < serviceAccounts.length; i += BATCH_SIZE) {
            const batch = serviceAccounts.slice(i, i + BATCH_SIZE);
            updatedServiceAccountsCount += await updateBatch(batch, true);
        }

        // Process service users in batches
        for (let i = 0; i < serviceUsers.length; i += BATCH_SIZE) {
            const batch = serviceUsers.slice(i, i + BATCH_SIZE);
            updatedServiceUsersCount += await updateBatch(batch, false);
        }

        return successResponse(
            `Updated ${updatedServiceAccountsCount} service accounts and ${updatedServiceUsersCount} service users`,
        );
    } catch (error) {
        console.error('Failed to update left days:', error);
        return errorResponse('Failed to update left days for service accounts or users', 500);
    }
};