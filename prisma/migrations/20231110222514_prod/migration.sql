-- DropForeignKey
ALTER TABLE "protocolo_documentos" DROP CONSTRAINT "protocolo_documentos_tipo_documento_id_fkey";

-- AlterTable
ALTER TABLE "departamentos" ADD COLUMN     "externo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "empresas_has_usuarios" ADD COLUMN     "tipo_usuario" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "protocolo_documentos" ADD COLUMN     "malote_virtual_id" INTEGER,
ADD COLUMN     "motivo_rejeitado" TEXT,
ADD COLUMN     "rejeitado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "retorna" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "valor" DOUBLE PRECISION,
ADD COLUMN     "vencimento" TIMESTAMP(3),
ALTER COLUMN "tipo_documento_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "protocolos" ADD COLUMN     "protocolo_malote" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sistema_setup" ADD COLUMN     "obriga_malote_fisico" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "rotas" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "turno" INTEGER NOT NULL DEFAULT 1,
    "dom" BOOLEAN NOT NULL DEFAULT false,
    "seg" BOOLEAN NOT NULL DEFAULT false,
    "ter" BOOLEAN NOT NULL DEFAULT false,
    "qua" BOOLEAN NOT NULL DEFAULT false,
    "qui" BOOLEAN NOT NULL DEFAULT false,
    "sex" BOOLEAN NOT NULL DEFAULT false,
    "sab" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malotes_setup" (
    "condominio_id" INTEGER NOT NULL,
    "rota_id" INTEGER NOT NULL,
    "motoqueiro_id" INTEGER NOT NULL,
    "quantidade_malotes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "malotes_fisicos" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "situacao" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "alerta" BOOLEAN NOT NULL DEFAULT false,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malotes_fisicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malotes_virtuais" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "malote_fisico_id" INTEGER,
    "malote_disponibilizado" BOOLEAN NOT NULL DEFAULT false,
    "situacao" INTEGER NOT NULL DEFAULT 1,
    "situacao_anterior" INTEGER,
    "protocolado_baixado" BOOLEAN NOT NULL DEFAULT false,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "data_saida" TIMESTAMP(3),
    "data_retorno" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malotes_virtuais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malotes_documentos" (
    "id" SERIAL NOT NULL,
    "malote_virtual_id" INTEGER NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "situacao" INTEGER NOT NULL DEFAULT 1,
    "justificativa" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malotes_documentos_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "malotes_setup_condominio_id_key" ON "malotes_setup"("condominio_id");

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_malote_virtual_id_fkey" FOREIGN KEY ("malote_virtual_id") REFERENCES "malotes_virtuais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotas" ADD CONSTRAINT "rotas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_setup" ADD CONSTRAINT "malotes_setup_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_setup" ADD CONSTRAINT "malotes_setup_rota_id_fkey" FOREIGN KEY ("rota_id") REFERENCES "rotas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_setup" ADD CONSTRAINT "malotes_setup_motoqueiro_id_fkey" FOREIGN KEY ("motoqueiro_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_fisicos" ADD CONSTRAINT "malotes_fisicos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_malote_fisico_id_fkey" FOREIGN KEY ("malote_fisico_id") REFERENCES "malotes_fisicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_virtuais" ADD CONSTRAINT "malotes_virtuais_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_documentos" ADD CONSTRAINT "malotes_documentos_malote_virtual_id_fkey" FOREIGN KEY ("malote_virtual_id") REFERENCES "malotes_virtuais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_documentos" ADD CONSTRAINT "malotes_documentos_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "protocolo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_fila_geracao" ADD CONSTRAINT "documentos_fila_geracao_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "protocolo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_fila_geracao" ADD CONSTRAINT "documentos_fila_geracao_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
