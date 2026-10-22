-- Transferências entre lojas (documento + lados + itens)
CREATE TYPE "CmvTransferenciaStatus" AS ENUM (
  'AGUARDANDO_ENTRADA',
  'AGUARDANDO_SAIDA',
  'CONCILIADA',
  'DIVERGENTE'
);

CREATE TYPE "CmvTransferenciaOrigem" AS ENUM ('SAIPOS', 'NFE_LOJA', 'MANUAL');

CREATE TYPE "CmvTransferenciaLadoTipo" AS ENUM ('SAIDA', 'ENTRADA');

CREATE TYPE "CmvTransferenciaCustoOrigem" AS ENUM (
  'ULTIMO_CUSTO_ORIGEM',
  'ESTOQUE_INICIAL_ORIGEM',
  'ULTIMO_CUSTO_QUALQUER_LOJA',
  'CUSTO_MANUAL'
);

CREATE TABLE "cmv_transferencias" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "numero_documento" TEXT NOT NULL,
  "data" TIMESTAMP(3) NOT NULL,
  "competencia" TEXT NOT NULL,
  "loja_origem" TEXT NOT NULL,
  "loja_destino" TEXT NOT NULL,
  "status" "CmvTransferenciaStatus" NOT NULL DEFAULT 'AGUARDANDO_ENTRADA',
  "origem" "CmvTransferenciaOrigem" NOT NULL,
  "saipos_transferencia_id" INTEGER,
  "nfe_nota_id" TEXT,
  "anexo_url" TEXT,
  "anexo_nome" TEXT,
  "observacao" TEXT,
  "criado_por_id" TEXT,
  "excluido_por_id" TEXT,
  "excluido_em" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cmv_transferencias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cmv_transferencia_lados" (
  "id" TEXT NOT NULL,
  "transferencia_id" TEXT NOT NULL,
  "tipo" "CmvTransferenciaLadoTipo" NOT NULL,
  "store_slug" TEXT NOT NULL,
  "registrado_por_id" TEXT,
  "registrado_em" TIMESTAMP(3),
  "rascunho" BOOLEAN NOT NULL DEFAULT false,
  "congelado" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cmv_transferencia_lados_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cmv_transferencia_itens" (
  "id" TEXT NOT NULL,
  "lado_id" TEXT NOT NULL,
  "estoque_insumo_id" TEXT NOT NULL,
  "quantidade" DECIMAL(14,4) NOT NULL,
  "unidade" "CmvRealUnidade" NOT NULL,
  "custo_unitario" DECIMAL(14,4),
  "valor_total" DECIMAL(14,2),
  "custo_origem" "CmvTransferenciaCustoOrigem",
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cmv_transferencia_itens_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cmv_lancamentos"
  ADD COLUMN "transferencia_item_id" TEXT;

CREATE UNIQUE INDEX "cmv_transferencias_user_numero_lojas_key"
  ON "cmv_transferencias" ("user_id", "numero_documento", "loja_origem", "loja_destino");

CREATE UNIQUE INDEX "cmv_transferencias_user_saipos_id_key"
  ON "cmv_transferencias" ("user_id", "saipos_transferencia_id")
  WHERE "saipos_transferencia_id" IS NOT NULL;

CREATE INDEX "cmv_transferencias_user_comp_status_idx"
  ON "cmv_transferencias" ("user_id", "competencia", "status");

CREATE INDEX "cmv_transferencias_user_origem_comp_idx"
  ON "cmv_transferencias" ("user_id", "loja_origem", "competencia");

CREATE INDEX "cmv_transferencias_user_destino_comp_idx"
  ON "cmv_transferencias" ("user_id", "loja_destino", "competencia");

CREATE INDEX "cmv_transferencias_nfe_nota_id_idx"
  ON "cmv_transferencias" ("nfe_nota_id");

CREATE UNIQUE INDEX "cmv_transferencia_lados_transferencia_id_tipo_key"
  ON "cmv_transferencia_lados" ("transferencia_id", "tipo");

CREATE INDEX "cmv_transferencia_lados_store_slug_idx"
  ON "cmv_transferencia_lados" ("store_slug");

CREATE UNIQUE INDEX "cmv_transferencia_itens_lado_id_estoque_insumo_id_key"
  ON "cmv_transferencia_itens" ("lado_id", "estoque_insumo_id");

CREATE INDEX "cmv_transferencia_itens_estoque_insumo_id_idx"
  ON "cmv_transferencia_itens" ("estoque_insumo_id");

CREATE UNIQUE INDEX "cmv_lancamentos_transferencia_item_id_key"
  ON "cmv_lancamentos" ("transferencia_item_id");

ALTER TABLE "cmv_transferencias"
  ADD CONSTRAINT "cmv_transferencias_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cmv_transferencias"
  ADD CONSTRAINT "cmv_transferencias_nfe_nota_id_fkey"
  FOREIGN KEY ("nfe_nota_id") REFERENCES "nfe_notas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "cmv_transferencia_lados"
  ADD CONSTRAINT "cmv_transferencia_lados_transferencia_id_fkey"
  FOREIGN KEY ("transferencia_id") REFERENCES "cmv_transferencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cmv_transferencia_itens"
  ADD CONSTRAINT "cmv_transferencia_itens_lado_id_fkey"
  FOREIGN KEY ("lado_id") REFERENCES "cmv_transferencia_lados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cmv_lancamentos"
  ADD CONSTRAINT "cmv_lancamentos_transferencia_item_id_fkey"
  FOREIGN KEY ("transferencia_item_id") REFERENCES "cmv_transferencia_itens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
