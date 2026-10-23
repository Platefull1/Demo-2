-- AlterTable: mudar default de status em delivery_riders de 'active' para 'pending_setup'
-- Riders existentes mantêm seus valores atuais; apenas novos cadastros nascem como 'pending_setup'
ALTER TABLE "delivery_riders" ALTER COLUMN "status" SET DEFAULT 'pending_setup';
