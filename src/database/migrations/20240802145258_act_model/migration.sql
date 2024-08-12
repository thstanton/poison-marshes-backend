/*
  Warnings:

  - You are about to drop the column `act` on the `Level` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sequence,actId]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actId` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Level_sequence_key";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "act",
ADD COLUMN     "actId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Act" (
    "id" SERIAL NOT NULL,
    "sequence" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Act_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Act_sequence_key" ON "Act"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "Level_sequence_actId_key" ON "Level"("sequence", "actId");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_actId_fkey" FOREIGN KEY ("actId") REFERENCES "Act"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
