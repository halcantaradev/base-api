-- AlterTable
ALTER TABLE "protocolo_documentos" ADD COLUMN     "retorna" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "valor" DOUBLE PRECISION,
ADD COLUMN     "vencimento" TIMESTAMP(3);
