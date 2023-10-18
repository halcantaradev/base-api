/*
  Warnings:

  - You are about to drop the column `tipo_contrato_id` on the `pessoas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pessoas" DROP CONSTRAINT "pessoas_tipo_contrato_id_fkey";

-- AlterTable
ALTER TABLE "pessoas" DROP COLUMN "tipo_contrato_id";

-- CreateTable
CREATE TABLE "condominios_has_tipos_contratos" (
    "condominio_id" INTEGER NOT NULL,
    "tipo_contrato_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condominios_has_tipos_contratos_pkey" PRIMARY KEY ("condominio_id","tipo_contrato_id")
);

-- CreateTable
CREATE TABLE "condominios_has_tipos_infracoes" (
    "id" SERIAL NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "tipo_infracao_id" INTEGER NOT NULL,
    "fundamentacao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "excluido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "condominios_has_tipos_infracoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "condominios_has_tipos_contratos" ADD CONSTRAINT "condominios_has_tipos_contratos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios_has_tipos_contratos" ADD CONSTRAINT "condominios_has_tipos_contratos_tipo_contrato_id_fkey" FOREIGN KEY ("tipo_contrato_id") REFERENCES "tipos_contratos_condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios_has_tipos_infracoes" ADD CONSTRAINT "condominios_has_tipos_infracoes_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios_has_tipos_infracoes" ADD CONSTRAINT "condominios_has_tipos_infracoes_tipo_infracao_id_fkey" FOREIGN KEY ("tipo_infracao_id") REFERENCES "tipos_infracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
