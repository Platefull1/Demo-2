-- Additive: novo valor no enum CategoriaOcorrencia.
-- Não usar prisma db push.

ALTER TYPE "CategoriaOcorrencia" ADD VALUE IF NOT EXISTS 'FALTOU_ITEM';
