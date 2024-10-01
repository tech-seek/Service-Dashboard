/*
  Warnings:

  - Made the column `endDate` on table `service_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "service_users" ALTER COLUMN "endDate" SET NOT NULL;
