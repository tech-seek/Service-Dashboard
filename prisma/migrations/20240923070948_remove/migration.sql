/*
  Warnings:

  - You are about to drop the column `name` on the `service_accounts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "service_accounts_id_name_email_idx";

-- DropIndex
DROP INDEX "service_accounts_name_key";

-- AlterTable
ALTER TABLE "service_accounts" DROP COLUMN "name";

-- CreateIndex
CREATE INDEX "service_accounts_id_email_idx" ON "service_accounts"("id", "email");
