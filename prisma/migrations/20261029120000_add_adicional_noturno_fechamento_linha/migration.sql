-- Adicional noturno no fechamento de ponto (HH:mm, nullable).
ALTER TABLE "fechamento_linhas" ADD COLUMN IF NOT EXISTS "adicionalNoturno" TEXT;
