-- AlterTable
ALTER TABLE "Act" ADD COLUMN     "emailId" INTEGER;

-- AddForeignKey
ALTER TABLE "Act" ADD CONSTRAINT "Act_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE SET NULL ON UPDATE CASCADE;
