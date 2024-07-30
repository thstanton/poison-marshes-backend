/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");
