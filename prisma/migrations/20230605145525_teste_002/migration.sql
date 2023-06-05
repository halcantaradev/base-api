/*
  Warnings:

  - Added the required column `cargo_id` to the `empresas_has_usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "empresas_has_usuarios" ADD COLUMN     "cargo_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "cargos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cargos_nome_key" ON "cargos"("nome");

-- AddForeignKey
ALTER TABLE "empresas_has_usuarios" ADD CONSTRAINT "empresas_has_usuarios_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
