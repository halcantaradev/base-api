/*
  Warnings:

  - You are about to drop the `table name` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "table name" DROP CONSTRAINT "table name_pessoa_id_fkey";

-- DropForeignKey
ALTER TABLE "table name" DROP CONSTRAINT "table name_tipo_id_fkey";

-- DropTable
DROP TABLE "table name";

-- CreateTable
CREATE TABLE "pessoas_has_tipo" (
    "id" SERIAL NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateda_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_has_tipo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pessoas_has_tipo" ADD CONSTRAINT "pessoas_has_tipo_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_tipo" ADD CONSTRAINT "pessoas_has_tipo_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "tipos_pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
