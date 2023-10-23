/*
  Warnings:

  - You are about to drop the column `malote_id` on the `malotes_documentos` table. All the data in the column will be lost.
  - Added the required column `malote_virtual_id` to the `malotes_documentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `malotes_virtuais` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "malotes_documentos" DROP CONSTRAINT "malotes_documentos_malote_id_fkey";

-- AlterTable
ALTER TABLE "malotes_documentos" DROP COLUMN "malote_id",
ADD COLUMN     "finalizado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "malote_virtual_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "malotes_virtuais" ADD COLUMN     "malote_baixado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "protocolos" ADD COLUMN     "malote_virtual_id" INTEGER;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_malote_virtual_id_fkey" FOREIGN KEY ("malote_virtual_id") REFERENCES "malotes_virtuais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_documentos" ADD CONSTRAINT "malotes_documentos_malote_virtual_id_fkey" FOREIGN KEY ("malote_virtual_id") REFERENCES "malotes_virtuais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
