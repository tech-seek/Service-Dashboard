import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse } from '../../helpers';

// Function to update left days and delete expired users
export const updateLeftDaysServiceUsers = async () => {
    try {
        const BATCH_SIZE = 100; // Adjust the batch size according to your database's capability
        const serviceUsers = await db.serviceUser.findMany();
        let updatedCount = 0;

        // Split the service users into batches
        for (let i = 0; i < serviceUsers.length; i += BATCH_SIZE) {
            const batch = serviceUsers.slice(i, i + BATCH_SIZE);

            const updatePromises = batch.map(async (user) => {
                const endDate = user?.endDate.toISOString() ?? '';
                const leftDays = calculateLeftDays(endDate);

                try {
                    if (leftDays > 0) {
                        await db.serviceUser.update({
                            where: { id: user.id },
                            data: { leftDays },
                        });
                        return 1; // Return 1 for successful updates
                    }
                    // Uncomment this block if you want to handle deletion of expired users
                    // else {
                    //     await db.serviceUser.delete({
                    //         where: { id: user.id },
                    //     });
                    //     return -1; // Return -1 for deletions
                    // }
                    return 0;
                } catch (error) {
                    console.error(`Error processing user ${user.id}:`, error);
                    return 0; // Return 0 for failed updates
                }
            });

            // Wait for all updates in the current batch to complete
            const results = await Promise.all(updatePromises);

            // Sum up the successful updates in this batch
            updatedCount += results.filter((result) => result > 0).length;
            // deletedCount += results.filter(result => result === -1).length;
        }

        return successResponse(`Updated ${updatedCount} users`);
    } catch (error) {
        console.error('Failed to update left days or delete users:', error);
        return errorResponse('Failed to update left days or delete users', 500);
    }
};
