/*
  Warnings:

  - You are about to drop the column `request` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `serviceAccountId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "request",
DROP COLUMN "service",
ADD COLUMN     "serviceAccountId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_serviceAccountId_fkey" FOREIGN KEY ("serviceAccountId") REFERENCES "service_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
