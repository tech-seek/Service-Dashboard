-- DropIndex
DROP INDEX "service_accounts_id_email_endDate_idx";

-- DropIndex
DROP INDEX "service_users_id_serviceAccountId_endDate_idx";

-- DropIndex
DROP INDEX "tasks_id_idx";

-- CreateIndex
CREATE INDEX "service_accounts_id_email_endDate_serviceId_leftDays_dealer_idx" ON "service_accounts"("id", "email", "endDate", "serviceId", "leftDays", "dealerId");

-- CreateIndex
CREATE INDEX "service_accounts_serviceId_email_idx" ON "service_accounts"("serviceId", "email");

-- CreateIndex
CREATE INDEX "service_accounts_serviceId_leftDays_idx" ON "service_accounts"("serviceId", "leftDays");

-- CreateIndex
CREATE INDEX "service_users_id_serviceAccountId_endDate_serviceId_provide_idx" ON "service_users"("id", "serviceAccountId", "endDate", "serviceId", "providerName", "leftDays");

-- CreateIndex
CREATE INDEX "tasks_id_serviceAccountId_serviceId_idx" ON "tasks"("id", "serviceAccountId", "serviceId");
