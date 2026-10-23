-- Renomeia coluna cpf -> cnpj na tabela delivery_riders
ALTER TABLE "delivery_riders" RENAME COLUMN "cpf" TO "cnpj";
