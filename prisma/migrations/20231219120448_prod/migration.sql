/*
  Warnings:

  - You are about to drop the column `logo_white` on the `temas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresa_id]` on the table `temas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "temas" DROP COLUMN "logo_white",
ADD COLUMN     "logo_clara" TEXT,
ALTER COLUMN "logo" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "temas_empresa_id_key" ON "temas"("empresa_id");
