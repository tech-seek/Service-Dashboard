/*
  Warnings:

  - A unique constraint covering the columns `[dealerId]` on the table `service_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "service_accounts" DROP CONSTRAINT "service_accounts_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "service_accounts" DROP CONSTRAINT "service_accounts_serviceId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "service_accounts_dealerId_key" ON "service_accounts"("dealerId");

-- AddForeignKey
ALTER TABLE "service_accounts" ADD CONSTRAINT "service_accounts_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_accounts" ADD CONSTRAINT "service_accounts_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
