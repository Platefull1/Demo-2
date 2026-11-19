-- Páginas ignoradas na conferência do lote
ALTER TABLE "payslip_batches" ADD COLUMN "ignoredPages" JSONB;
