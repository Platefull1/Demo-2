-- Reparo idempotente: coluna correta do schema Prisma + remoção do typo órfão.
-- Em produção já existe "vencimentos" com dados; "vencosimentos" está vazia.
-- Na branch Neon "dev" (clone) as duas colunas existem até este SQL rodar.

ALTER TABLE "rh_rescisoes"
  ADD COLUMN IF NOT EXISTS "vencimentos" JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE "rh_rescisoes"
  DROP COLUMN IF EXISTS "vencosimentos";
