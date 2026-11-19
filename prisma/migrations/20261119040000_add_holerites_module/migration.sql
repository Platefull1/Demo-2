-- CreateEnum
CREATE TYPE "PayslipType" AS ENUM ('MENSAL', 'ADIANTAMENTO', 'DECIMO_TERCEIRO_1', 'DECIMO_TERCEIRO_2', 'FERIAS', 'RESCISAO');

-- CreateEnum
CREATE TYPE "PayslipStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'VIEWED', 'ACKNOWLEDGED', 'REVOKED');

-- CreateEnum
CREATE TYPE "PayslipBatchStatus" AS ENUM ('PROCESSING', 'REVIEW', 'PUBLISHED', 'CANCELLED');

-- AlterTable: portal do colaborador (defaults / nullable — sem backfill destrutivo)
ALTER TABLE "rh_funcionarios" ADD COLUMN "portalLastLoginAt" TIMESTAMP(3),
ADD COLUMN "portalStatus" TEXT NOT NULL DEFAULT 'enabled',
ADD COLUMN "portalTokenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "payslip_batches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "competencia" TEXT NOT NULL,
    "type" "PayslipType" NOT NULL,
    "status" "PayslipBatchStatus" NOT NULL DEFAULT 'PROCESSING',
    "sourceFiles" JSONB NOT NULL,
    "unmatchedPages" JSONB,
    "errorMessage" TEXT,
    "notifyStatus" TEXT,
    "createdBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payslip_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslips" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "lojaId" TEXT NOT NULL,
    "competencia" TEXT NOT NULL,
    "type" "PayslipType" NOT NULL,
    "status" "PayslipStatus" NOT NULL DEFAULT 'DRAFT',
    "storagePath" TEXT NOT NULL,
    "fileSha256" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "netAmountCents" INTEGER,
    "rhNote" TEXT,
    "replacesId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "firstViewedAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "ackIp" TEXT,
    "ackUserAgent" TEXT,
    "ackFileSha256" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payslips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslip_access_logs" (
    "id" TEXT NOT NULL,
    "payslipId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payslip_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_login_codes" (
    "id" TEXT NOT NULL,
    "funcionarioId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumedAt" TIMESTAMP(3),
    "requestIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_login_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_buckets" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "payslip_batches_userId_competencia_idx" ON "payslip_batches"("userId", "competencia");

-- CreateIndex
CREATE INDEX "payslips_userId_competencia_status_idx" ON "payslips"("userId", "competencia", "status");

-- CreateIndex
CREATE INDEX "payslips_funcionarioId_status_idx" ON "payslips"("funcionarioId", "status");

-- Índice único parcial: um holerite ativo por (funcionario, competência, tipo)
CREATE UNIQUE INDEX "payslip_active_unique" ON "payslips"("funcionarioId", "competencia", "type") WHERE status <> 'REVOKED';

-- CreateIndex
CREATE INDEX "payslip_access_logs_payslipId_idx" ON "payslip_access_logs"("payslipId");

-- CreateIndex
CREATE INDEX "employee_login_codes_funcionarioId_createdAt_idx" ON "employee_login_codes"("funcionarioId", "createdAt");

-- CreateIndex
CREATE INDEX "rate_limit_buckets_expires_at_idx" ON "rate_limit_buckets"("expires_at");

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "payslip_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "rh_funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "rh_lojas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_replacesId_fkey" FOREIGN KEY ("replacesId") REFERENCES "payslips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_access_logs" ADD CONSTRAINT "payslip_access_logs_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "payslips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_login_codes" ADD CONSTRAINT "employee_login_codes_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "rh_funcionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
