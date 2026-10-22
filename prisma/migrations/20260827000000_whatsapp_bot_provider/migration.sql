-- AlterTable: WhatsAppBot.provider ('wpp' | 'baileys'), default 'wpp'
-- Existing rows get 'wpp' — no behavior change until manual UPDATE.

ALTER TABLE "whatsapp_bots" ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'wpp';

CREATE INDEX IF NOT EXISTS "whatsapp_bots_provider_idx" ON "whatsapp_bots"("provider");
