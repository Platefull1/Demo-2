-- Migration: adiciona campos de auditoria de edição ao documento de transferência CMV
ALTER TABLE cmv_transferencias
  ADD COLUMN editado_por_id TEXT,
  ADD COLUMN editado_em TIMESTAMPTZ;
