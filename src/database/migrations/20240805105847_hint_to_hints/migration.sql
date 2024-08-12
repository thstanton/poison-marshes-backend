/*
  Warnings:

  - You are about to drop the column `hint` on the `Level` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Level" DROP COLUMN "hint",
ADD COLUMN     "hints" TEXT[];
