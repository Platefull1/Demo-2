-- Total Not.Tot. do Secullum no fechamento (HH:mm, nullable).
ALTER TABLE "fechamento_linhas" ADD COLUMN IF NOT EXISTS "adicionalNoturnoSecullum" TEXT;
