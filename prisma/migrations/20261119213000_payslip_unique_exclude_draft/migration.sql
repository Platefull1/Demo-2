-- Permite DRAFT de retificação coexistir com holerite já publicado.
-- Unicidade ativa só para status visíveis ao colaborador.
DROP INDEX IF EXISTS "payslip_active_unique";

CREATE UNIQUE INDEX "payslip_active_unique"
  ON "payslips" ("funcionarioId", competencia, type)
  WHERE status IN ('PUBLISHED', 'VIEWED', 'ACKNOWLEDGED');
