-- AlterTable
ALTER TABLE "pessoas_has_tipo" ADD COLUMN     "integracao_id" INTEGER;

-- AddForeignKey
ALTER TABLE "pessoas_has_tipo" ADD CONSTRAINT "pessoas_has_tipo_integracao_id_fkey" FOREIGN KEY ("integracao_id") REFERENCES "integracoes_database"("id") ON DELETE SET NULL ON UPDATE CASCADE;

