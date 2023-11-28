-- AlterTable
ALTER TABLE "malotes_virtuais" ADD COLUMN     "lacre_retorno" TEXT,
ADD COLUMN     "lacre_saida" TEXT;

-- CreateTable
CREATE TABLE "malote_documento_historicos" (
    "id" SERIAL NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "situacao" INTEGER NOT NULL,
    "descricao" TEXT,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malote_documento_historicos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "malote_documento_historicos" ADD CONSTRAINT "malote_documento_historicos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malote_documento_historicos" ADD CONSTRAINT "malote_documento_historicos_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "protocolo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
