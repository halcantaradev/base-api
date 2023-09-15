-- AlterTable
ALTER TABLE "integracoes_database" ADD COLUMN     "excluido" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "token" DROP NOT NULL;
