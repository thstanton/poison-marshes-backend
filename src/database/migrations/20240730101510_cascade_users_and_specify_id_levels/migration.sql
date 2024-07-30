/*
  Warnings:

  - You are about to drop the column `description` on the `Level` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `act` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flavourText` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_accountId_fkey";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "description",
ADD COLUMN     "act" INTEGER NOT NULL,
ADD COLUMN     "flavourText" TEXT NOT NULL,
ADD COLUMN     "task" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Level_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Level_id_key" ON "Level"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
