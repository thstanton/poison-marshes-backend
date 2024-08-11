/*
  Warnings:

  - Made the column `solution` on table `Level` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Level" ALTER COLUMN "solution" SET NOT NULL;
