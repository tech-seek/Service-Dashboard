-- DropForeignKey
ALTER TABLE "service_accounts" DROP CONSTRAINT "service_accounts_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "service_accounts" DROP CONSTRAINT "service_accounts_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "service_accounts" ADD CONSTRAINT "service_accounts_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_accounts" ADD CONSTRAINT "service_accounts_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
