-- Breakdown da venda líquida Saipos (bruto / taxa / consumo / créditos / ajuste).
ALTER TABLE "cmv_fechamentos" ADD COLUMN IF NOT EXISTS "venda_mes_detalhe" JSONB;
