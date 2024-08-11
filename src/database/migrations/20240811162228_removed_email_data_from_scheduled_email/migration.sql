/*
  Warnings:

  - You are about to drop the column `from` on the `ScheduledEmail` table. All the data in the column will be lost.
  - You are about to drop the column `html` on the `ScheduledEmail` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `ScheduledEmail` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `ScheduledEmail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduledEmail" DROP COLUMN "from",
DROP COLUMN "html",
DROP COLUMN "subject",
DROP COLUMN "text";
