-- Fotos escolhidas ao destacar a ocorrência na ata.
ALTER TABLE "ocorrencias" ADD COLUMN IF NOT EXISTS "destaqueFotoPaths" TEXT[] DEFAULT ARRAY[]::TEXT[];
