/*
  Warnings:

  - A unique constraint covering the columns `[actId]` on the table `Email` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Act" DROP CONSTRAINT "Act_emailId_fkey";

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "actId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Email_actId_key" ON "Email"("actId");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_actId_fkey" FOREIGN KEY ("actId") REFERENCES "Act"("id") ON DELETE SET NULL ON UPDATE CASCADE;
