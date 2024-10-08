-- DropIndex
DROP INDEX "service_accounts_id_email_idx";

-- DropIndex
DROP INDEX "service_users_id_serviceAccountId_idx";

-- CreateIndex
CREATE INDEX "service_accounts_id_email_endDate_idx" ON "service_accounts"("id", "email", "endDate");

-- CreateIndex
CREATE INDEX "service_users_id_serviceAccountId_endDate_idx" ON "service_users"("id", "serviceAccountId", "endDate");
