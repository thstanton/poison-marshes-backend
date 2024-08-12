/*
  Warnings:

  - You are about to drop the column `emailId` on the `ScheduledEmail` table. All the data in the column will be lost.
  - Added the required column `from` to the `ScheduledEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `html` to the `ScheduledEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `ScheduledEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `ScheduledEmail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScheduledEmail" DROP CONSTRAINT "ScheduledEmail_emailId_fkey";

-- AlterTable
ALTER TABLE "ScheduledEmail" DROP COLUMN "emailId",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "html" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
