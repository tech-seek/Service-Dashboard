/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse } from '../helpers';

const BATCH_SIZE = 50; // Adjust the batch size according to your database's capability

// Helper function to update left days for a batch of records
const updateBatch = async (batch: any[], isAccount: boolean) => {
    const updatePromises = batch.map(async (record) => {
        const endDate = record?.endDate.toISOString() ?? '';
        const leftDays = calculateLeftDays(endDate);
        if (leftDays >= 0) {
            try {
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

// Function to update service accounts
const updateServiceAccounts = async () => {
    const serviceAccounts = await db.serviceAccount.findMany({
        select: { id: true, endDate: true },
    });

    const batchPromises = [];
    for (let i = 0; i < serviceAccounts.length; i += BATCH_SIZE) {
        const batch = serviceAccounts.slice(i, i + BATCH_SIZE);
        batchPromises.push(updateBatch(batch, true));
    }
    const updatedCount = (await Promise.all(batchPromises)).reduce((sum, count) => sum + count, 0);
    return updatedCount;
};

// Function to update service users
const updateServiceUsers = async () => {
    const serviceUsers = await db.serviceUser.findMany({ select: { id: true, endDate: true } });

    const batchPromises = [];
    for (let i = 0; i < serviceUsers.length; i += BATCH_SIZE) {
        const batch = serviceUsers.slice(i, i + BATCH_SIZE);
        batchPromises.push(updateBatch(batch, false));
    }
    const updatedCount = (await Promise.all(batchPromises)).reduce((sum, count) => sum + count, 0);
    return updatedCount;
};

// Main function to update left days for both service accounts and service users
export const updateLeftDays = async () => {
    try {
        // Run both updates concurrently
        const [updatedServiceAccountsCount, updatedServiceUsersCount] = await Promise.all([
            updateServiceAccounts(),
            updateServiceUsers(),
        ]);

        return successResponse(
            `Updated ${updatedServiceAccountsCount} service accounts and ${updatedServiceUsersCount} service users`,
        );
    } catch (error) {
        console.error('Failed to update left days:', error);
        return errorResponse('Failed to update left days for service accounts or users', 500);
    }
};
