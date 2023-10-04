-- CreateTable
CREATE TABLE "documentos_fila_geracao" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "gerado" BOOLEAN NOT NULL DEFAULT false,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_fila_geracao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documentos_fila_geracao" ADD CONSTRAINT "documentos_fila_geracao_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "protocolo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_fila_geracao" ADD CONSTRAINT "documentos_fila_geracao_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
