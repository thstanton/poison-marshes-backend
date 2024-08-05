/*
  Warnings:

  - You are about to drop the column `actId` on the `Level` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sequence,actSequence]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actSequence` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_actId_fkey";

-- DropIndex
DROP INDEX "Level_sequence_actId_key";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "actId",
ADD COLUMN     "actSequence" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Level_sequence_actSequence_key" ON "Level"("sequence", "actSequence");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_actSequence_fkey" FOREIGN KEY ("actSequence") REFERENCES "Act"("sequence") ON DELETE CASCADE ON UPDATE CASCADE;
