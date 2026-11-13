-- Auditoria da resolução de divergência (WhatsApp)
ALTER TABLE "cmv_transferencias"
  ADD COLUMN IF NOT EXISTS "resolucao_divergencia" JSONB;
