-- Transferências via WhatsApp: sessão de conversa + origem WHATSAPP + config + LID

ALTER TYPE "CmvTransferenciaOrigem" ADD VALUE 'WHATSAPP';

CREATE TYPE "SessaoTransferenciaEstado" AS ENUM (
  'AGUARDANDO_CONFIRMACAO_ORIGEM',
  'AGUARDANDO_ESCLARECIMENTO',
  'AGUARDANDO_RECEBIMENTO',
  'CONCLUIDA',
  'DIVERGENTE',
  'CANCELADA',
  'EXPIRADA'
);

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "transferencias_whatsapp_bot_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "users_transferencias_whatsapp_bot_id_key"
  ON "users"("transferencias_whatsapp_bot_id");

ALTER TABLE "rh_funcionarios"
  ADD COLUMN IF NOT EXISTS "whatsapp_lid" VARCHAR(32);

CREATE INDEX IF NOT EXISTS "rh_funcionarios_whatsapp_lid_idx"
  ON "rh_funcionarios"("whatsapp_lid");

CREATE TABLE IF NOT EXISTS "sessoes_transferencia" (
  "id" TEXT NOT NULL,
  "codigo" TEXT NOT NULL,
  "tenant_user_id" TEXT NOT NULL,
  "loja_origem" TEXT NOT NULL,
  "loja_destino" TEXT NOT NULL,
  "gerente_origem_id" TEXT NOT NULL,
  "gerente_destino_id" TEXT,
  "telefone_origem" TEXT NOT NULL,
  "lid_origem" VARCHAR(32),
  "estado" "SessaoTransferenciaEstado" NOT NULL DEFAULT 'AGUARDANDO_CONFIRMACAO_ORIGEM',
  "itens" JSONB NOT NULL,
  "mensagem_original" TEXT,
  "cmv_transferencia_id" TEXT,
  "lembrete_enviado_em" TIMESTAMP(3),
  "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "confirmacao_origem_em" TIMESTAMP(3),
  "esclarecimento_em" TIMESTAMP(3),
  "recebimento_em" TIMESTAMP(3),
  "concluida_em" TIMESTAMP(3),
  "divergente_em" TIMESTAMP(3),
  "cancelada_em" TIMESTAMP(3),
  "expirada_em" TIMESTAMP(3),
  "atualizada_em" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sessoes_transferencia_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sessoes_transferencia_tenant_user_id_codigo_key"
  ON "sessoes_transferencia"("tenant_user_id", "codigo");

CREATE UNIQUE INDEX IF NOT EXISTS "sessoes_transferencia_cmv_transferencia_id_key"
  ON "sessoes_transferencia"("cmv_transferencia_id");

CREATE INDEX IF NOT EXISTS "sessoes_transferencia_tenant_user_id_estado_idx"
  ON "sessoes_transferencia"("tenant_user_id", "estado");

CREATE INDEX IF NOT EXISTS "sessoes_transferencia_telefone_origem_estado_idx"
  ON "sessoes_transferencia"("telefone_origem", "estado");

CREATE INDEX IF NOT EXISTS "sessoes_transferencia_lid_origem_estado_idx"
  ON "sessoes_transferencia"("lid_origem", "estado");

CREATE INDEX IF NOT EXISTS "sessoes_transferencia_loja_origem_estado_idx"
  ON "sessoes_transferencia"("loja_origem", "estado");

CREATE INDEX IF NOT EXISTS "sessoes_transferencia_loja_destino_estado_idx"
  ON "sessoes_transferencia"("loja_destino", "estado");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_transferencias_whatsapp_bot_id_fkey'
  ) THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_transferencias_whatsapp_bot_id_fkey"
      FOREIGN KEY ("transferencias_whatsapp_bot_id")
      REFERENCES "whatsapp_bots"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_transferencia_tenant_user_id_fkey'
  ) THEN
    ALTER TABLE "sessoes_transferencia"
      ADD CONSTRAINT "sessoes_transferencia_tenant_user_id_fkey"
      FOREIGN KEY ("tenant_user_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_transferencia_gerente_origem_id_fkey'
  ) THEN
    ALTER TABLE "sessoes_transferencia"
      ADD CONSTRAINT "sessoes_transferencia_gerente_origem_id_fkey"
      FOREIGN KEY ("gerente_origem_id") REFERENCES "rh_funcionarios"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_transferencia_gerente_destino_id_fkey'
  ) THEN
    ALTER TABLE "sessoes_transferencia"
      ADD CONSTRAINT "sessoes_transferencia_gerente_destino_id_fkey"
      FOREIGN KEY ("gerente_destino_id") REFERENCES "rh_funcionarios"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_transferencia_cmv_transferencia_id_fkey'
  ) THEN
    ALTER TABLE "sessoes_transferencia"
      ADD CONSTRAINT "sessoes_transferencia_cmv_transferencia_id_fkey"
      FOREIGN KEY ("cmv_transferencia_id") REFERENCES "cmv_transferencias"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
