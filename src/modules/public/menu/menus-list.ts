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
		url: null,
		icon: 'usergroup-add',
		target: '_self',
	},
	{
		id_relation: 7,
		relation: 1,
		label: 'Buscar',
		url: 'departamentos/buscar',
		icon: 'add',
		target: '_self',
	},
	{
		id_relation: 99990,
		label: 'Configurações',
		url: 'configuracoes',
		icon: 'setting',
		target: '_self',
	},
	{
		id_relation: 99991,
		relation: 99990,
		label: 'Usuários',
		url: 'usuarios',
		icon: 'user',
		target: '_self',
	},
	{
		id_relation: 99992,
		relation: 99990,
		label: 'Permissões',
		url: 'permissoes',
		icon: 'guard',
		target: '_self',
	},
];
