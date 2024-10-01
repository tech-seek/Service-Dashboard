/*
  Warnings:

  - Added the required column `providerId` to the `service_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_users" ADD COLUMN     "providerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "histories_id_idx" ON "histories"("id");

-- AddForeignKey
ALTER TABLE "service_users" ADD CONSTRAINT "service_users_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
