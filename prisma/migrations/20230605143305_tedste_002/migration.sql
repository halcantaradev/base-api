/*
  Warnings:

  - You are about to drop the `pessoas_has_usuarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nome` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pessoas_has_usuarios" DROP CONSTRAINT "pessoas_has_usuarios_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "pessoas_has_usuarios" DROP CONSTRAINT "pessoas_has_usuarios_usuario_id_fkey";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "nome" TEXT NOT NULL;

-- DropTable
DROP TABLE "pessoas_has_usuarios";

-- CreateTable
CREATE TABLE "empresas_has_usuarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_has_usuarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "empresas_has_usuarios" ADD CONSTRAINT "empresas_has_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_has_usuarios" ADD CONSTRAINT "empresas_has_usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
