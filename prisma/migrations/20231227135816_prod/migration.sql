/*
  Warnings:

  - You are about to drop the column `condominio_id` on the `protocolo_documentos` table. All the data in the column will be lost.
  - Made the column `pessoa_id` on table `protocolo_documentos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "protocolo_documentos" DROP CONSTRAINT "protocolo_documentos_condominio_id_fkey";

-- AlterTable
ALTER TABLE "protocolo_documentos" DROP COLUMN "condominio_id",
ALTER COLUMN "pessoa_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
