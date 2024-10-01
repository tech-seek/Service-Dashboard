/*
  Warnings:

  - You are about to drop the column `emai` on the `service_users` table. All the data in the column will be lost.
  - Added the required column `type` to the `service_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_users" DROP COLUMN "emai",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;
