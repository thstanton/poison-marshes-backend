/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Level` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Level" DROP COLUMN "videoUrl",
ADD COLUMN     "videoId" TEXT;
