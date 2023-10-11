/*
  Warnings:

  - You are about to drop the column `usa_malote_fisico` on the `sistema_setup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sistema_setup" DROP COLUMN "usa_malote_fisico",
ADD COLUMN     "obriga_malote_fisico" BOOLEAN NOT NULL DEFAULT false;
