-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_actId_fkey";

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_actId_fkey" FOREIGN KEY ("actId") REFERENCES "Act"("id") ON DELETE CASCADE ON UPDATE CASCADE;
