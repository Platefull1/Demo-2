CREATE TABLE IF NOT EXISTS "rh_bonificacoes_assiduidade" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "valorDireito" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "recebeu" BOOLEAN NOT NULL DEFAULT true,
    "motivo" TEXT,
    "registradoPor" TEXT,
    "viaIA" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rh_bonificacoes_assiduidade_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "rh_bonificacoes_assiduidade_funcionarioId_mes_ano_key"
    ON "rh_bonificacoes_assiduidade"("funcionarioId", "mes", "ano");
CREATE INDEX IF NOT EXISTS "rh_bonificacoes_assiduidade_funcionarioId_idx"
    ON "rh_bonificacoes_assiduidade"("funcionarioId");

CREATE TABLE IF NOT EXISTS "rh_plr_trimestrais" (
    "id" TEXT NOT NULL,
    "lojaId" TEXT NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorPorFuncionario" DOUBLE PRECISION NOT NULL,
    "metaBatida" BOOLEAN NOT NULL DEFAULT true,
    "observacao" TEXT,
    "registradoPor" TEXT,
    "viaIA" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rh_plr_trimestrais_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "rh_plr_trimestrais_lojaId_trimestre_ano_key"
    ON "rh_plr_trimestrais"("lojaId", "trimestre", "ano");
CREATE INDEX IF NOT EXISTS "rh_plr_trimestrais_lojaId_idx"
    ON "rh_plr_trimestrais"("lojaId");

CREATE TABLE IF NOT EXISTS "rh_plr_pagamentos" (
    "id" TEXT NOT NULL,
    "plrId" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rh_plr_pagamentos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "rh_plr_pagamentos_plrId_funcionarioId_key"
    ON "rh_plr_pagamentos"("plrId", "funcionarioId");
CREATE INDEX IF NOT EXISTS "rh_plr_pagamentos_funcionarioId_idx"
    ON "rh_plr_pagamentos"("funcionarioId");

ALTER TABLE "rh_bonificacoes_assiduidade"
    ADD CONSTRAINT "rh_bonificacoes_assiduidade_funcionarioId_fkey"
    FOREIGN KEY ("funcionarioId") REFERENCES "rh_funcionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rh_plr_trimestrais"
    ADD CONSTRAINT "rh_plr_trimestrais_lojaId_fkey"
    FOREIGN KEY ("lojaId") REFERENCES "rh_lojas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rh_plr_pagamentos"
    ADD CONSTRAINT "rh_plr_pagamentos_plrId_fkey"
    FOREIGN KEY ("plrId") REFERENCES "rh_plr_trimestrais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rh_plr_pagamentos"
    ADD CONSTRAINT "rh_plr_pagamentos_funcionarioId_fkey"
    FOREIGN KEY ("funcionarioId") REFERENCES "rh_funcionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
