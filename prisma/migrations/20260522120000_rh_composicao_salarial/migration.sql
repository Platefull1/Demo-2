-- Migração: composição salarial + CPF/data nascimento obrigatórios + bonificações trimestrais

-- Novos campos de composição salarial
ALTER TABLE "rh_funcionarios" ADD COLUMN IF NOT EXISTS "salarioBase" DOUBLE PRECISION;
ALTER TABLE "rh_funcionarios" ADD COLUMN IF NOT EXISTS "valorAlimentacao" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "rh_funcionarios" ADD COLUMN IF NOT EXISTS "valorVT" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "rh_funcionarios" ADD COLUMN IF NOT EXISTS "cargoResponsabilidade" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "rh_funcionarios" ADD COLUMN IF NOT EXISTS "bonificacaoAssiduidade" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Copiar salário bruto legado para salário base
UPDATE "rh_funcionarios"
SET "salarioBase" = "salarioBruto"
WHERE "salarioBase" IS NULL AND "salarioBruto" IS NOT NULL;

UPDATE "rh_funcionarios"
SET "salarioBase" = 0
WHERE "salarioBase" IS NULL;

-- CPF temporário para registros sem CPF (evita conflito na constraint)
UPDATE "rh_funcionarios"
SET "cpf" = LPAD(SUBSTRING(REPLACE("id", '-', '') FROM 1 FOR 11), 11, '0')
WHERE "cpf" IS NULL OR TRIM("cpf") = '';

-- Data de nascimento obrigatória
ALTER TABLE "rh_funcionarios" ADD COLUMN IF NOT EXISTS "dataNascimento_new" TIMESTAMP(3);
UPDATE "rh_funcionarios"
SET "dataNascimento_new" = COALESCE("dataNascimento", TIMESTAMP '1990-01-01 00:00:00');
ALTER TABLE "rh_funcionarios" DROP COLUMN IF EXISTS "dataNascimento";
ALTER TABLE "rh_funcionarios" RENAME COLUMN "dataNascimento_new" TO "dataNascimento";
ALTER TABLE "rh_funcionarios" ALTER COLUMN "dataNascimento" SET NOT NULL;

ALTER TABLE "rh_funcionarios" ALTER COLUMN "salarioBase" SET NOT NULL;
ALTER TABLE "rh_funcionarios" ALTER COLUMN "cpf" SET NOT NULL;

ALTER TABLE "rh_funcionarios" DROP COLUMN IF EXISTS "salarioBruto";

CREATE UNIQUE INDEX IF NOT EXISTS "rh_funcionarios_userId_cpf_key" ON "rh_funcionarios"("userId", "cpf");

-- Bonificações trimestrais
CREATE TABLE IF NOT EXISTS "rh_bonificacoes_trimestrais" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "registradoPor" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rh_bonificacoes_trimestrais_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "rh_bonificacoes_trimestrais_funcionarioId_trimestre_ano_key"
    ON "rh_bonificacoes_trimestrais"("funcionarioId", "trimestre", "ano");
CREATE INDEX IF NOT EXISTS "rh_bonificacoes_trimestrais_funcionarioId_idx"
    ON "rh_bonificacoes_trimestrais"("funcionarioId");

ALTER TABLE "rh_bonificacoes_trimestrais"
    ADD CONSTRAINT "rh_bonificacoes_trimestrais_funcionarioId_fkey"
    FOREIGN KEY ("funcionarioId") REFERENCES "rh_funcionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
