-- CreateTable
CREATE TABLE "malotes_virtuais" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "malote_fisico_id" INTEGER,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malotes_virtuais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malotes_documentos" (
    "id" SERIAL NOT NULL,
    "malote_id" INTEGER NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malotes_documentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_malote_fisico_id_fkey" FOREIGN KEY ("malote_fisico_id") REFERENCES "malotes_fisicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_documentos" ADD CONSTRAINT "malotes_documentos_malote_id_fkey" FOREIGN KEY ("malote_id") REFERENCES "malotes_virtuais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_documentos" ADD CONSTRAINT "malotes_documentos_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "protocolo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
