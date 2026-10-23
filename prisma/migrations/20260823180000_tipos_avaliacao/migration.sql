-- Migration: Tipos de Avaliação por loja
-- Aplicada via `prisma db push`. Para ambientes com migrate, use este SQL como referência.
-- Após aplicar, rodar: npx tsx scripts/backfill-tipos-avaliacao.ts

-- Tipos por loja
ALTER TABLE "tipos_avaliacao" ADD COLUMN IF NOT EXISTS "lojaId" TEXT;
ALTER TABLE "tipos_avaliacao" ADD COLUMN IF NOT EXISTS "lojaNome" TEXT;

DROP INDEX IF EXISTS "tipos_avaliacao_userId_nome_key";
CREATE UNIQUE INDEX IF NOT EXISTS "tipos_avaliacao_userId_lojaId_nome_key"
  ON "tipos_avaliacao"("userId", "lojaId", "nome");
CREATE INDEX IF NOT EXISTS "tipos_avaliacao_userId_lojaId_idx"
  ON "tipos_avaliacao"("userId", "lojaId");

-- Plano: um registro por loja + período + tipo
ALTER TABLE "bonificacao_trimestres" ALTER COLUMN "tipoAvaliacaoId" SET NOT NULL;

DROP INDEX IF EXISTS "bonificacao_trimestres_userId_lojaNome_ano_trimestre_key";
CREATE UNIQUE INDEX IF NOT EXISTS "bonificacao_trimestres_userId_lojaNome_ano_trimestre_tipoAvaliacaoId_key"
  ON "bonificacao_trimestres"("userId", "lojaNome", "ano", "trimestre", "tipoAvaliacaoId");

ALTER TABLE "bonificacao_trimestres" DROP CONSTRAINT IF EXISTS "bonificacao_trimestres_tipoAvaliacaoId_fkey";
ALTER TABLE "bonificacao_trimestres"
  ADD CONSTRAINT "bonificacao_trimestres_tipoAvaliacaoId_fkey"
  FOREIGN KEY ("tipoAvaliacaoId") REFERENCES "tipos_avaliacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
