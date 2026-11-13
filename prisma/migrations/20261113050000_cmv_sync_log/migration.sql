-- CreateEnum
CREATE TYPE "CmvSyncStatus" AS ENUM ('SUCESSO', 'FALHA');

-- CreateTable
CREATE TABLE "cmv_sync_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "store_slug" TEXT NOT NULL,
    "de" TEXT NOT NULL,
    "ate" TEXT NOT NULL,
    "competencias" JSONB NOT NULL DEFAULT '[]',
    "status" "CmvSyncStatus" NOT NULL,
    "erro" TEXT,
    "duracao_ms" INTEGER NOT NULL,
    "detalhe" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cmv_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cmv_sync_logs_user_id_store_slug_created_at_idx" ON "cmv_sync_logs"("user_id", "store_slug", "created_at");

-- AddForeignKey
ALTER TABLE "cmv_sync_logs" ADD CONSTRAINT "cmv_sync_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
