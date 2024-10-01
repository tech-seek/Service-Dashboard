/*
  Warnings:

  - Added the required column `serviceId` to the `service_users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'solved');

-- AlterTable
ALTER TABLE "service_users" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "historyId" TEXT,
ADD COLUMN     "serviceUserId" TEXT;

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "serviceid" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "lastExpire" TEXT NOT NULL,

    CONSTRAINT "histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_id_idx" ON "tasks"("id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "histories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_serviceUserId_fkey" FOREIGN KEY ("serviceUserId") REFERENCES "service_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
