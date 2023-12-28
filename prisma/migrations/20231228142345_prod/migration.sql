-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "empresa_id" INTEGER,
    "numero" TEXT,
    "endereco" TEXT,
    "cep" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "categoria_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_pessoas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "perfil" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_has_tipo" (
    "id" SERIAL NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_has_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "ramal" TEXT,
    "rocket_user_id" TEXT,
    "rocket_token" TEXT,
    "secret" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "primeiro_acesso" BOOLEAN NOT NULL DEFAULT true,
    "acessa_todos_departamentos" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas_has_usuarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_has_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" SERIAL NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_has_unidades" (
    "id" SERIAL NOT NULL,
    "unidade_id" INTEGER NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "pessoa_tipo_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_has_unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "module" TEXT NOT NULL DEFAULT 'Padrão',
    "key" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos_has_permissoes" (
    "cargo_id" INTEGER NOT NULL,
    "permissao_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_has_permissoes_pkey" PRIMARY KEY ("cargo_id","permissao_id","empresa_id")
);

-- CreateTable
CREATE TABLE "usuario_has_permissoes" (
    "usuario_id" INTEGER NOT NULL,
    "permissao_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_has_permissoes_pkey" PRIMARY KEY ("usuario_id","permissao_id","empresa_id")
);

-- CreateTable
CREATE TABLE "arquivos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "origem" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "referencia_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" SERIAL NOT NULL,
    "origem" INTEGER NOT NULL,
    "contato" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tipo" INTEGER NOT NULL DEFAULT 1,
    "referencia_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "permissao_id" INTEGER,
    "icon" TEXT NOT NULL,
    "target" TEXT NOT NULL DEFAULT '_self',
    "menu_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "filial_id" INTEGER NOT NULL,
    "nac" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_has_departamentos" (
    "usuario_id" INTEGER NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "delimitar_acesso" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_has_departamentos_pkey" PRIMARY KEY ("usuario_id","departamento_id")
);

-- CreateTable
CREATE TABLE "condominio_has_departamentos" (
    "condominio_id" INTEGER NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condominio_has_departamentos_pkey" PRIMARY KEY ("condominio_id","departamento_id")
);

-- CreateTable
CREATE TABLE "usuario_has_condominios" (
    "usuario_id" INTEGER NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_has_condominios_pkey" PRIMARY KEY ("usuario_id","condominio_id")
);

-- CreateTable
CREATE TABLE "cargos_condominio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sindico" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_condominio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condominio_administracao" (
    "id" SERIAL NOT NULL,
    "condominio_id" INTEGER NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condominio_administracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sistema_setup" (
    "empresa_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "tipos_contratos_condominio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_contratos_condominio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condominios_has_tipos_contratos" (
    "condominio_id" INTEGER NOT NULL,
    "tipo_contrato_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condominios_has_tipos_contratos_pkey" PRIMARY KEY ("condominio_id","tipo_contrato_id")
);

-- CreateTable
CREATE TABLE "filiais" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "logo" TEXT,
    "logo_clara" TEXT,
    "empresa_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocolos" (
    "id" SERIAL NOT NULL,
    "tipo" INTEGER NOT NULL DEFAULT 1,
    "empresa_id" INTEGER NOT NULL,
    "destino_departamento_id" INTEGER NOT NULL,
    "origem_departamento_id" INTEGER NOT NULL,
    "destino_usuario_id" INTEGER,
    "origem_usuario_id" INTEGER,
    "data_finalizado" TIMESTAMP(3),
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "motivo_cancelado" TEXT,
    "situacao" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocolos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocolo_documentos" (
    "id" SERIAL NOT NULL,
    "protocolo_id" INTEGER NOT NULL,
    "tipo_documento_id" INTEGER,
    "condominio_id" INTEGER NOT NULL,
    "aceite_usuario_id" INTEGER,
    "discriminacao" TEXT NOT NULL,
    "observacao" TEXT,
    "retorna" BOOLEAN NOT NULL DEFAULT false,
    "data_aceite" TIMESTAMP(3),
    "aceito" BOOLEAN NOT NULL DEFAULT false,
    "rejeitado" BOOLEAN NOT NULL DEFAULT false,
    "motivo_rejeitado" TEXT,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "vencimento" TIMESTAMP(3),
    "valor" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocolo_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_documentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails_setup" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "host" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "padrao" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "emails_setup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conexoes_socket" (
    "socket_id" TEXT NOT NULL,
    "usuario_id" INTEGER,
    "empresa_id" INTEGER,
    "sala" TEXT NOT NULL,
    "data_conexao" TIMESTAMP(3) NOT NULL,
    "data_desconexao" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "conexoes_socket_pkey" PRIMARY KEY ("socket_id")
);

-- CreateTable
CREATE TABLE "notificacoes_eventos" (
    "id" SERIAL NOT NULL,
    "sala" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "rota" TEXT,
    "data" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificacoes_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento_protocolo_historicos" (
    "id" SERIAL NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "situacao" INTEGER NOT NULL,
    "descricao" TEXT,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documento_protocolo_historicos_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "tipos_pessoas_nome_key" ON "tipos_pessoas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_pessoas_descricao_key" ON "tipos_pessoas"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "cargos_nome_key" ON "cargos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "menus_url_key" ON "menus"("url");

-- CreateIndex
CREATE UNIQUE INDEX "sistema_setup_empresa_id_key" ON "sistema_setup"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "temas_empresa_id_key" ON "temas"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "parametros_sistema_chave_key" ON "parametros_sistema"("chave");

-- AddForeignKey
ALTER TABLE "pessoas_has_tipo" ADD CONSTRAINT "pessoas_has_tipo_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_tipo" ADD CONSTRAINT "pessoas_has_tipo_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "tipos_pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_has_usuarios" ADD CONSTRAINT "empresas_has_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_has_usuarios" ADD CONSTRAINT "empresas_has_usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_has_usuarios" ADD CONSTRAINT "empresas_has_usuarios_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_unidades" ADD CONSTRAINT "pessoas_has_unidades_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_unidades" ADD CONSTRAINT "pessoas_has_unidades_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_has_unidades" ADD CONSTRAINT "pessoas_has_unidades_pessoa_tipo_id_fkey" FOREIGN KEY ("pessoa_tipo_id") REFERENCES "tipos_pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_has_permissoes" ADD CONSTRAINT "cargos_has_permissoes_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_has_permissoes" ADD CONSTRAINT "cargos_has_permissoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_has_permissoes" ADD CONSTRAINT "cargos_has_permissoes_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_permissoes" ADD CONSTRAINT "usuario_has_permissoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_permissoes" ADD CONSTRAINT "usuario_has_permissoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_permissoes" ADD CONSTRAINT "usuario_has_permissoes_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_filial_id_fkey" FOREIGN KEY ("filial_id") REFERENCES "filiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_departamentos" ADD CONSTRAINT "usuario_has_departamentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_departamentos" ADD CONSTRAINT "usuario_has_departamentos_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominio_has_departamentos" ADD CONSTRAINT "condominio_has_departamentos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominio_has_departamentos" ADD CONSTRAINT "condominio_has_departamentos_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_condominios" ADD CONSTRAINT "usuario_has_condominios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_condominios" ADD CONSTRAINT "usuario_has_condominios_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominio_administracao" ADD CONSTRAINT "condominio_administracao_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominio_administracao" ADD CONSTRAINT "condominio_administracao_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargos_condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sistema_setup" ADD CONSTRAINT "sistema_setup_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios_has_tipos_contratos" ADD CONSTRAINT "condominios_has_tipos_contratos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios_has_tipos_contratos" ADD CONSTRAINT "condominios_has_tipos_contratos_tipo_contrato_id_fkey" FOREIGN KEY ("tipo_contrato_id") REFERENCES "tipos_contratos_condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiais" ADD CONSTRAINT "filiais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temas" ADD CONSTRAINT "temas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_destino_departamento_id_fkey" FOREIGN KEY ("destino_departamento_id") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_origem_departamento_id_fkey" FOREIGN KEY ("origem_departamento_id") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_destino_usuario_id_fkey" FOREIGN KEY ("destino_usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_origem_usuario_id_fkey" FOREIGN KEY ("origem_usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_protocolo_id_fkey" FOREIGN KEY ("protocolo_id") REFERENCES "protocolos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolo_documentos" ADD CONSTRAINT "protocolo_documentos_aceite_usuario_id_fkey" FOREIGN KEY ("aceite_usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails_setup" ADD CONSTRAINT "emails_setup_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conexoes_socket" ADD CONSTRAINT "conexoes_socket_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_protocolo_historicos" ADD CONSTRAINT "documento_protocolo_historicos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_protocolo_historicos" ADD CONSTRAINT "documento_protocolo_historicos_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "protocolo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametros_sistema" ADD CONSTRAINT "parametros_sistema_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
