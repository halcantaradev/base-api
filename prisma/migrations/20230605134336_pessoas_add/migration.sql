/*
  Warnings:

  - You are about to drop the `empresas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empresas_has_usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "empresas_has_usuarios" DROP CONSTRAINT "empresas_has_usuarios_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "empresas_has_usuarios" DROP CONSTRAINT "empresas_has_usuarios_usuario_id_fkey";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "empresas";

-- DropTable
DROP TABLE "empresas_has_usuarios";

-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,
    "cep" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_pessoas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table name" (
    "id" SERIAL NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_has_usuarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_has_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_nome_key" ON "pessoas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_cnpj_key" ON "pessoas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_pessoas_nome_key" ON "tipos_pessoas"("nome");

-- AddForeignKey
ALTER TABLE "table name" ADD CONSTRAINT "table name_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table name" ADD CONSTRAINT "table name_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "tipos_pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_usuarios" ADD CONSTRAINT "pessoas_has_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_usuarios" ADD CONSTRAINT "pessoas_has_usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
