-- CreateEnum
CREATE TYPE "RescisaoStatus" AS ENUM ('RASCUNHO', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "TipoRescisao" AS ENUM (
  'DISPENSA_SEM_JUSTA_CAUSA',
  'DISPENSA_COM_JUSTA_CAUSA',
  'PEDIDO_DE_DISPENSA',
  'ANTECIPADA_EMPREGADOR',
  'ANTECIPADA_EMPREGADO'
);

-- CreateEnum
CREATE TYPE "TipoAviso" AS ENUM (
  'INDENIZADO_IMEDIATO',
  'TRABALHADO_REDUCAO_7_DIAS',
  'TRABALHADO_REDUCAO_2_HORAS',
  'TERMINO_EXPERIENCIA',
  'ANTECIPADA_EMPREGADOR',
  'RESCISAO_POR_MORTE',
  'AVISO_TRABALHADO_30_DIAS',
  'AVISO_MEIO_INDENIZADO',
  'DISPENSADO'
);

-- AlterTable
ALTER TABLE "rh_funcionarios" ADD COLUMN "dataDemissao" DATE;

-- CreateTable
CREATE TABLE "rh_rescisoes" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "status" "RescisaoStatus" NOT NULL DEFAULT 'RASCUNHO',
    "empresa" TEXT NOT NULL DEFAULT 'BRULUVAS',
    "codigoSnapshot" TEXT,
    "nomeSnapshot" TEXT NOT NULL,
    "dataAdmissaoSnapshot" DATE,
    "salarioSnapshot" DECIMAL(10,2) NOT NULL,
    "dataDesligamento" DATE NOT NULL,
    "cumpreAviso" BOOLEAN,
    "descontaAviso" BOOLEAN,
    "inicioAviso" DATE,
    "terminoAviso" DATE,
    "possuiEstabilidade" BOOLEAN,
    "tipoEstabilidade" TEXT,
    "foiTransferido" BOOLEAN,
    "empresaOrigem" TEXT,
    "tipoRescisao" "TipoRescisao",
    "tipoAviso" "TipoAviso",
    "motivo" TEXT,
    "vencosimentos" JSONB NOT NULL DEFAULT '[]',
    "descontos" JSONB NOT NULL DEFAULT '[]',
    "criadoPorId" TEXT NOT NULL,
    "finalizadoPorId" TEXT,
    "finalizadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rh_rescisoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rh_rescisoes_funcionarioId_status_idx" ON "rh_rescisoes"("funcionarioId", "status");

-- Um rascunho por funcionário (finalizadas podem coexistir após reativação)
CREATE UNIQUE INDEX "rh_rescisoes_funcionarioId_rascunho_uidx"
  ON "rh_rescisoes"("funcionarioId")
  WHERE status = 'RASCUNHO';

-- AddForeignKey
ALTER TABLE "rh_rescisoes"
  ADD CONSTRAINT "rh_rescisoes_funcionarioId_fkey"
  FOREIGN KEY ("funcionarioId") REFERENCES "rh_funcionarios"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
