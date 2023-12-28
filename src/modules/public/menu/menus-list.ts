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
	// CONDOMINIO
	{
		id_relation: 1,
		label: 'Condominios',
		url: null,
		icon: 'shop',
		target: '_self',
	},
	{
		id_relation: 2,
		permission_key: 'condominios-listar',
		relation: 1,
		label: 'Buscar',
		url: 'condominios',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 3,
		permission_key: 'condominios-cadastrar',
		relation: 1,
		label: 'Cadastrar',
		url: 'condominios/cadastrar',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 4,
		permission_key: 'unidades-listar',
		relation: 1,
		label: 'Unidades',
		url: 'unidades',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 5,
		permission_key: 'condominios-listar-documentos',
		relation: 1,
		label: 'Documentos',
		url: 'condominios/documentos',
		icon: 'setting',
		target: '_self',
	},

	// PROTOCOLO
	{
		id_relation: 6,
		label: 'Protocolos',
		url: null,
		icon: 'container',
		target: '_self',
	},
	{
		id_relation: 7,
		permission_key: 'protocolos-listar',
		relation: 6,
		label: 'Buscar',
		url: 'protocolos/buscar',
		icon: 'container',
		target: '_self',
	},
	{
		id_relation: 8,
		permission_key: 'protocolos-cadastrar',
		relation: 6,
		label: 'Cadastrar',
		url: 'protocolos/cadastrar',
		icon: 'container',
		target: '_self',
		ativo: true,
	},
	{
		id_relation: 9,
		permission_key: 'protocolos-documentos-aceitar',
		relation: 6,
		label: 'Aceitar',
		url: 'protocolos/aceitar',
		icon: 'container',
		target: '_self',
	},

	// SEGURANÇA
	{
		id_relation: 10,
		label: 'Segurança',
		url: null,
		icon: 'security-scan',
		target: '_self',
	},
	{
		id_relation: 11,
		relation: 10,
		permission_key: 'permissoes-listar',
		label: 'Permissões',
		url: 'permissoes',
		icon: 'guard',
		target: '_self',
	},
	{
		id_relation: 12,
		relation: 10,
		permission_key: 'usuarios-listar-todos',
		label: 'Usuários',
		url: 'usuarios',
		icon: 'user',
		target: '_self',
	},

	// CONFIGURAÇÃO
	{
		id_relation: 13,
		label: 'Configurações',
		url: null,
		icon: 'setting',
		target: '_self',
	},

	{
		id_relation: 14,
		relation: 13,
		permission_key: 'cargos-listar',
		label: 'Cargos',
		url: 'cargos',
		icon: 'wallet',
		target: '_self',
	},

	{
		id_relation: 15,
		relation: 13,
		label: 'Departamentos',
		permission_key: 'departamentos-listar',
		url: 'departamentos/buscar',
		icon: 'team',
		target: '_self',
	},
	{
		id_relation: 16,
		relation: 13,
		label: 'Filiais',
		permission_key: 'filiais-listar',
		url: 'filiais/buscar',
		icon: 'shop',
		target: '_self',
	},
	{
		id_relation: 17,
		relation: 13,
		label: 'Tipos de contratos',
		permission_key: 'tipo-contrato-listar',
		url: 'tipos-de-contrato/buscar',
		icon: 'file-done',
		target: '_self',
		ativo: false,
	},
	{
		id_relation: 18,
		relation: 13,
		label: 'Sistema',
		permission_key: 'setup-sistema-listar',
		url: 'sistema/listar',
		icon: 'setting',
		target: '_self',
	},
	{
		id_relation: 19,
		relation: 13,
		label: 'Tipos de documentos',
		permission_key: 'tipos-documentos-listar',
		url: 'tipos-de-documentos/buscar',
		icon: 'file_text',
		target: '_self',
	},
];
