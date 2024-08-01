/*
  Warnings:

  - A unique constraint covering the columns `[sequence]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequence` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Level_id_key";

-- AlterTable
CREATE SEQUENCE level_id_seq;
ALTER TABLE "Level" ADD COLUMN     "sequence" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('level_id_seq');
ALTER SEQUENCE level_id_seq OWNED BY "Level"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Level_sequence_key" ON "Level"("sequence");
