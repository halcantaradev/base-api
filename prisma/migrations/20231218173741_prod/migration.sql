-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "rocket_token" TEXT,
ADD COLUMN     "rocket_user_id" TEXT;

-- CreateTable
CREATE TABLE "parametros_sistema" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "descricao" TEXT,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametros_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parametros_sistema_chave_key" ON "parametros_sistema"("chave");

-- AddForeignKey
ALTER TABLE "parametros_sistema" ADD CONSTRAINT "parametros_sistema_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
