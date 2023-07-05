export const menulist: Array<{
	id_relation: number;
	relation?: number;
	permission_key?: string;
	label: string;
	url: string;
	icon: string;
	target: string;
}> = [
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
		url: 'notificacoes/',
		icon: 'unordered_list_outline',
		target: '_self',
	},
	{
		id_relation: 3,
		relation: 1,
		permission_key: 'notificacoes-cadastrar',
		label: 'Incluir',
		url: 'notificacoes/cadastrar',
		icon: 'add',
		target: '_self',
	},
	{
		id_relation: 4,
		relation: 1,
		label: 'Modelos',
		url: 'notificacoes/modelos',
		icon: 'add',
		target: '_self',
	},
	{
		id_relation: 5,
		relation: 1,
		label: 'Configurações',
		url: 'notificacoes/configuracoes',
		icon: 'add',
		target: '_self',
	},
	{
		id_relation: 6,
		label: 'Departamentos',
		permission_key: 'departamentos-listar',
		url: 'departamentos/buscar',
		icon: 'usergroup-add',
		target: '_self',
	},
	{
		id_relation: 7,
		permission_key: 'condominios-listar',
		label: 'Condominios',
		url: 'condominios',
		icon: 'shop',
		target: '_self',
	},
	{
		id_relation: 99990,
		label: 'Configurações',
		url: null,
		icon: 'setting',
		target: '_self',
	},
	{
		id_relation: 99991,
		relation: 99990,
		permission_key: 'usuarios-listar-todos',
		label: 'Usuários',
		url: 'usuarios',
		icon: 'user',
		target: '_self',
	},
	{
		id_relation: 99992,
		relation: 99990,
		permission_key: 'permissions-cargos-listar',
		label: 'Permissões',
		url: 'permissoes',
		icon: 'guard',
		target: '_self',
	},
];
