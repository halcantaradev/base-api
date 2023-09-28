-- AlterTable
ALTER TABLE "empresas_has_usuarios" ADD COLUMN     "tipo_usuario" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "malotes_fisicos" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "situacao" INTEGER NOT NULL DEFAULT 1,
    "empresa_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "alerta" BOOLEAN NOT NULL DEFAULT false,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "malotes_fisicos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "malotes_fisicos" ADD CONSTRAINT "malotes_fisicos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
