-- AlterTable
ALTER TABLE "malotes_documentos" ADD COLUMN     "estornado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "malotes_virtuais" ADD COLUMN     "data_saida" TIMESTAMP(3);
