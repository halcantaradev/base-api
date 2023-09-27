-- AlterTable
ALTER TABLE "departamentos" ADD COLUMN     "externo" BOOLEAN NOT NULL DEFAULT false;

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

-- AddForeignKey
ALTER TABLE "rotas" ADD CONSTRAINT "rotas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
