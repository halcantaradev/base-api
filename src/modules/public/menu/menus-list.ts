export const menulist: Array<{
	id_relation: number;
	relation?: number;
	permission_key?: string;
	label: string;
	url: string | null;
	icon: string;
	target: string;
	ativo?: boolean;
}> = [
	// NOTIFICAÇÃO
	{
		id_relation: 1,
		label: 'Notificações',
		url: null,
		icon: 'notification',
		target: '_self',
	},
	{
		id_relation: 2,
		relation: 1,
		permission_key: 'notificacoes-listar',
		label: 'Buscar',
		url: 'notificacoes/busca',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 3,
		relation: 1,
		permission_key: 'notificacoes-cadastrar',
		label: 'Cadastrar',
		url: 'notificacoes/cadastrar',
		icon: 'add',
		target: '_self',
	},
	{
		id_relation: 4,
		relation: 1,
		permission_key: 'layouts-notificacao-listar',
		label: 'Modelos',
		url: 'notificacoes/modelos',
		icon: 'add',
		target: '_self',
		ativo: false,
	},
	// CONDOMINIO
	{
		id_relation: 7,
		label: 'Condominios',
		url: null,
		icon: 'shop',
		target: '_self',
	},
	{
		id_relation: 8,
		permission_key: 'condominios-listar',
		relation: 7,
		label: 'Buscar',
		url: 'condominios',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 8,
		permission_key: 'condominios-cadastrar',
		relation: 7,
		label: 'Cadastrar',
		url: 'condominios/cadastrar',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 9,
		relation: 1,
		label: 'Tipos de infração',
		permission_key: 'notificacoes-infracoes-listar',
		url: 'notificacoes/tipos-infracao',
		icon: 'edit',
		target: '_self',
	},
	{
		id_relation: 10,
		permission_key: 'condominio-acessar-configuracoes',
		relation: 7,
		label: 'Configurações',
		url: 'condominios/configuracoes',
		icon: 'setting',
		target: '_self',
	},

	// PROTOCOLO
	{
		id_relation: 11,
		label: 'Protocolos',
		url: null,
		icon: 'container',
		target: '_self',
	},
	{
		id_relation: 12,
		permission_key: 'protocolos-listar',
		relation: 11,
		label: 'Buscar',
		url: 'protocolos/buscar',
		icon: 'container',
		target: '_self',
	},
	{
		id_relation: 14,
		permission_key: 'protocolos-documentos-aceitar',
		relation: 11,
		label: 'Aceitar',
		url: 'protocolos/aceitar',
		icon: 'container',
		target: '_self',
	},
	{
		id_relation: 13,
		permission_key: 'protocolos-cadastrar',
		relation: 11,
		label: 'Cadastrar',
		url: 'protocolos/cadastrar',
		icon: 'container',
		target: '_self',
		ativo: true,
	},

	// SEGURANÇA
	{
		id_relation: 99980,
		label: 'Segurança',
		url: null,
		icon: 'security-scan',
		target: '_self',
	},
	{
		id_relation: 99981,
		relation: 99980,
		permission_key: 'permissoes-listar',
		label: 'Permissões',
		url: 'permissoes',
		icon: 'guard',
		target: '_self',
	},
	{
		id_relation: 99982,
		relation: 99980,
		permission_key: 'usuarios-listar-todos',
		label: 'Usuários',
		url: 'usuarios',
		icon: 'user',
		target: '_self',
	},

	// CONFIGURAÇÃO
	{
		id_relation: 99990,
		label: 'Configurações',
		url: null,
		icon: 'setting',
		target: '_self',
	},

	{
		id_relation: 99992,
		relation: 99990,
		permission_key: 'cargos-listar',
		label: 'Cargos',
		url: 'cargos',
		icon: 'wallet',
		target: '_self',
	},

	{
		id_relation: 99994,
		relation: 99990,
		label: 'Departamentos',
		permission_key: 'departamentos-listar',
		url: 'departamentos/buscar',
		icon: 'team',
		target: '_self',
	},
	{
		id_relation: 99995,
		relation: 99990,
		label: 'Filiais',
		permission_key: 'filiais-listar',
		url: 'filiais/buscar',
		icon: 'shop',
		target: '_self',
	},
	{
		id_relation: 99996,
		relation: 99990,
		label: 'Tipos de contratos',
		permission_key: 'tipo-contrato-listar',
		url: 'tipos-de-contrato/buscar',
		icon: 'file-done',
		target: '_self',
	},
	{
		id_relation: 99997,
		relation: 99990,
		label: 'Sistema',
		permission_key: 'setup-sistema-listar',
		url: 'sistema/listar',
		icon: 'setting',
		target: '_self',
	},
	{
		id_relation: 99998,
		relation: 99990,
		label: 'Tipos de documentos',
		permission_key: 'tipos-documentos-listar',
		url: 'tipos-de-documentos/buscar',
		icon: 'file_text',
		target: '_self',
	},
];
