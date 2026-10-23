-- AlterTable
ALTER TABLE "whatsapp_messages" ADD COLUMN "complaintProcessedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "whatsapp_messages_userId_contactId_complaintProcessedAt_idx" ON "whatsapp_messages"("userId", "contactId", "complaintProcessedAt");
