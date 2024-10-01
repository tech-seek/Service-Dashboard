/*
  Warnings:

  - You are about to drop the column `provider` on the `histories` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "histories" DROP CONSTRAINT "histories_serviceId_fkey";

-- DropIndex
DROP INDEX "histories_id_idx";

-- AlterTable
ALTER TABLE "histories" DROP COLUMN "provider",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "histories_id_serviceId_providerId_idx" ON "histories"("id", "serviceId", "providerId");

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
