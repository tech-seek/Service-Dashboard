import { calculateLeftDays } from '@/lib/utils';
import { db, errorResponse, successResponse } from '../../helpers';


// export const updateLeftDaysServiceAccounts = async () => {
//     try {
//         const serviceAccounts = await db.serviceAccount.findMany();
//         let updatedCount = 0;
//         // let deletedCount = 0;

//         for (const account of serviceAccounts) {
//             const endDate = account?.endDate.toISOString() ?? '';
//             const leftDays = calculateLeftDays( endDate);
//             console.log('Processing account:', account);

//             try {
//                 if (leftDays > 0) {
//                     console.log(`Updating account ${account.id} with ${leftDays} days left`);
//                     await db.serviceAccount.update({
//                         where: { id: account.id },
//                         data: { leftDays },
//                     });
//                     updatedCount++;
//                 }
//                 // else {
//                 //     console.log(`Deleting expired account ${account.id}`);
//                 //     await db.serviceAccount.delete({
//                 //         where: { id: account.id },
//                 //     });
//                 //     deletedCount++;
//                 // }
//             } catch (error) {
//                 console.error(`Error processing account ${account.id}:`, error);
//             }
//         }

//         return successResponse(`Updated ${updatedCount} accounts`);
//     } catch (error) {
//         console.error('Failed to update left days or delete accounts:', error);
//         return errorResponse('Failed to update left days or delete accounts', 500);
//     }
// };

export const updateLeftDaysServiceAccounts = async () => {
    try {
        const BATCH_SIZE = 100; // Adjust the batch size based on your database's capability and performance
        const serviceAccounts = await db.serviceAccount.findMany();
        let updatedCount = 0;

        // Split the service accounts into batches
        for (let i = 0; i < serviceAccounts.length; i += BATCH_SIZE) {
            const batch = serviceAccounts.slice(i, i + BATCH_SIZE);

            const updatePromises = batch.map(async (account) => {
                const endDate = account?.endDate.toISOString() ?? '';
                const leftDays = calculateLeftDays(endDate);

                if (leftDays > 0) {
                    try {
                        await db.serviceAccount.update({
                            where: { id: account.id },
                            data: { leftDays },
                        });
                        return 1; // Return 1 for successful updates
                    } catch (error) {
                        console.error(`Error updating account ${account.id}:`, error);
                        return 0; // Return 0 for failed updates
                    }
                }
                return 0;
            });

            // Wait for all updates in the current batch to complete
            const results = await Promise.all(updatePromises);

            // Sum up the successful updates in this batch
           updatedCount += results.reduce((sum: number, val: number) => sum + val, 0);
        }

        return successResponse(`Updated ${updatedCount} accounts`);
    } catch (error) {
        console.error('Failed to update left days or delete accounts:', error);
        return errorResponse('Failed to update left days or delete accounts', 500);
    }
};