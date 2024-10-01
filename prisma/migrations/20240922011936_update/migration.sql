/*
  Warnings:

  - You are about to drop the column `serviceid` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `historyId` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `serviceUserId` on the `services` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_historyId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_serviceUserId_fkey";

-- AlterTable
ALTER TABLE "histories" DROP COLUMN "serviceid",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "historyId",
DROP COLUMN "serviceUserId";

-- AddForeignKey
ALTER TABLE "service_users" ADD CONSTRAINT "service_users_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
