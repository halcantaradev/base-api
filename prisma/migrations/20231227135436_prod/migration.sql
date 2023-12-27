-- AlterTable
ALTER TABLE "protocolo_documentos" ADD COLUMN     "pessoa_id" INTEGER;

-- Set value on pessoa_id
UPDATE "protocolo_documentos" SET pessoa_id = condominio_id;