export const permissionslist: Array<{
	label: string;
	key: string;
	message: string;
}> = [
	{
		label: 'Listar todos os usuários',
		key: 'usuarios-listar-todos',
		message: 'Sem permissão para listar todos os usuários',
	},
	{
		label: 'Exibir dados do usuário',
		key: 'usuarios-exibir-dados',
		message: 'Sem permissão para listar dados do usuário',
	},
	{
		label: 'Listar permissões do cargo',
		key: 'permissions-cargos-listar',
		message: 'Sem permissão para listar as permissões do cargo',
	},
	{
		label: 'Conceder permissões aos cargos',
		key: 'permissoes-cargos-conceder',
		message: 'Sem permissão para conceder permissão ao cargo',
	},
	{
		label: 'Listar usuários ativos',
		key: 'usuarios-listar-ativos',
		message: 'Sem permissão para listar usuários ativos',
	},
];
