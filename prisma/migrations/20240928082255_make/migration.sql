/*
  Warnings:

  - You are about to drop the column `providerId` on the `service_users` table. All the data in the column will be lost.
  - Added the required column `providerName` to the `service_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "service_users" DROP CONSTRAINT "service_users_providerId_fkey";

-- AlterTable
ALTER TABLE "service_users" DROP COLUMN "providerId",
ADD COLUMN     "providerName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "service_users" ADD CONSTRAINT "service_users_providerName_fkey" FOREIGN KEY ("providerName") REFERENCES "users"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;
