-- DropForeignKey
ALTER TABLE "Issues" DROP CONSTRAINT "Issues_meetingId_fkey";

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
