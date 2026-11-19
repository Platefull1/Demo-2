-- Origem no staging para vínculo manual / desvincular
ALTER TABLE "payslips" ADD COLUMN "sourcePath" TEXT;
ALTER TABLE "payslips" ADD COLUMN "sourcePageIndexes" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
