;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse } from '../helpers';


const BATCH_SIZE = 10; // Adjust the batch size according to your database's capability

// Helper function to update many records at once
const updateManyRecords = async (ids: string[], leftDays: number, isAccount: boolean) => {
    try {
        await (db[isAccount ? 'serviceAccount' : 'serviceUser'] as any).updateMany({
            where: { id: { in: ids } },
            data: { leftDays },
        });
        return ids.length; // Return the number of updated records
    } catch (error) {
        console.error(
            `Error updating ${isAccount ? 'service accounts' : 'service users'} with leftDays=${leftDays}:`,
            error,
        );
        return 0; // Return 0 for failed updates
    }
};

// Helper function to process batches of records
const processBatches = async (records: any[], isAccount: boolean) => {
   const updates: Record<number, string[]> = {};

    // Group records by leftDays value
    records.forEach((record) => {
        const endDate = record?.endDate.toISOString() ?? '';
        const leftDays = calculateLeftDays(endDate);

        if (leftDays >= 0) {
            if (!updates[leftDays]) {
                updates[leftDays] = [];
            }
            updates[leftDays].push(record.id); // Group by leftDays
        }
    });

    const batchPromises = [];
    for (const [leftDays, ids] of Object.entries(updates)) {
        // Process records with the same leftDays in batches
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const batch = ids.slice(i, i + BATCH_SIZE);
            batchPromises.push(updateManyRecords(batch, Number(leftDays), isAccount));
        }
    }

    const updatedCount = (await Promise.all(batchPromises)).reduce((sum, count) => sum + count, 0);
    return updatedCount;
};

// Function to update service accounts
const updateServiceAccounts = async () => {
    const serviceAccounts = await db.serviceAccount.findMany({
        select: { id: true, endDate: true },
    });

    return await processBatches(serviceAccounts, true);
};

// Function to update service users
const updateServiceUsers = async () => {
    const serviceUsers = await db.serviceUser.findMany({
        select: { id: true, endDate: true },
    });

    return await processBatches(serviceUsers, false);
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