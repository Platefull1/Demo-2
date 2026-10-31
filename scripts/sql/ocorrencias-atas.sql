-- Additive: atas de ocorrências (não usar prisma db push no banco de produção).
-- Rodar no Neon depois do deploy, ou localmente se precisar dos campos.

ALTER TABLE "ocorrencias"
  ADD COLUMN IF NOT EXISTS "destaqueAta" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "destaqueAtaPorId" TEXT,
  ADD COLUMN IF NOT EXISTS "destaqueAtaEm" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "ocorrencias_userId_destaqueAta_idx"
  ON "ocorrencias" ("userId", "destaqueAta");

CREATE TABLE IF NOT EXISTS "ocorrencia_atrasos_mensais" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "lojaId" TEXT NOT NULL,
  "ano" INTEGER NOT NULL,
  "mes" INTEGER NOT NULL,
  "quantidade" INTEGER NOT NULL,
  "atualizadoPorId" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ocorrencia_atrasos_mensais_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ocorrencia_atrasos_mensais_companyId_lojaId_ano_mes_key"
  ON "ocorrencia_atrasos_mensais" ("companyId", "lojaId", "ano", "mes");

CREATE INDEX IF NOT EXISTS "ocorrencia_atrasos_mensais_companyId_ano_mes_idx"
  ON "ocorrencia_atrasos_mensais" ("companyId", "ano", "mes");

CREATE TABLE IF NOT EXISTS "ocorrencia_atas" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "ano" INTEGER NOT NULL,
  "mes" INTEGER NOT NULL,
  "escopo" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "geradaPorId" TEXT NOT NULL,
  "geradaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ocorrencia_atas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ocorrencia_atas_companyId_ano_mes_escopo_key"
  ON "ocorrencia_atas" ("companyId", "ano", "mes", "escopo");

CREATE INDEX IF NOT EXISTS "ocorrencia_atas_companyId_ano_mes_idx"
  ON "ocorrencia_atas" ("companyId", "ano", "mes");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ocorrencia_atrasos_mensais_companyId_fkey'
  ) THEN
    ALTER TABLE "ocorrencia_atrasos_mensais"
      ADD CONSTRAINT "ocorrencia_atrasos_mensais_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ocorrencia_atrasos_mensais_lojaId_fkey'
  ) THEN
    ALTER TABLE "ocorrencia_atrasos_mensais"
      ADD CONSTRAINT "ocorrencia_atrasos_mensais_lojaId_fkey"
      FOREIGN KEY ("lojaId") REFERENCES "rh_lojas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ocorrencia_atas_companyId_fkey'
  ) THEN
    ALTER TABLE "ocorrencia_atas"
      ADD CONSTRAINT "ocorrencia_atas_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
