-- CreateTable
CREATE TABLE "malotes_setup" (
    "condominio_id" INTEGER NOT NULL,
    "rota_id" INTEGER NOT NULL,
    "motoqueiro_id" INTEGER NOT NULL,
    "quantidade_malotes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "malotes_setup_condominio_id_key" ON "malotes_setup"("condominio_id");

-- AddForeignKey
ALTER TABLE "malotes_setup" ADD CONSTRAINT "malotes_setup_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_setup" ADD CONSTRAINT "malotes_setup_rota_id_fkey" FOREIGN KEY ("rota_id") REFERENCES "rotas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malotes_setup" ADD CONSTRAINT "malotes_setup_motoqueiro_id_fkey" FOREIGN KEY ("motoqueiro_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
