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
	{
		label: 'Cadastrar notificação',
		key: 'notificacoes-cadastrar',
		message: 'Sem permissão para cadastrar notificação',
	},
	{
		label: 'Listar  notificações',
		key: 'notificacoes-listar',
		message: 'Sem permissão para listar notificação',
	},
	{
		label: 'Exibir dados de uma notificação',
		key: 'notificacoes-exibir-dados',
		message: 'Sem permissão para exibir dados da notificação',
	},
	{
		label: 'Atualizar dados da notificação',
		key: 'notificacoes-atualizar-dados',
		message: 'Sem permissão para atualizar notificação',
	},
	{
		label: 'Gerar relatórios de notificações',
		key: 'notificacoes-relatorios-condominio',
		message: 'Sem permissão para gerar relatórios de notificações',
	},
	{
		label: 'Cadastrar notificação',
		key: 'notificacoes-infracoes-cadastrar',
		message: 'Sem permissão para cadastrar notificação',
	},
	{
		label: 'Listar  notificações',
		key: 'notificacoes-infracoes-listar',
		message: 'Sem permissão para listar notificação',
	},
	{
		label: 'Exibir dados de uma notificação',
		key: 'notificacoes-infracoes-exibir-dados',
		message: 'Sem permissão para exibir dados da notificação',
	},
	{
		label: 'Atualizar dados da notificação',
		key: 'notificacoes-infracoes-atualizar-dados',
		message: 'Sem permissão para atualizar notificação',
	},
	{
		label: 'Listar todos os condomínios',
		key: 'condominios-listar',
		message: 'Sem permissão para listar condomínios',
	},
	{
		label: 'Acessar configurações do condomínio',
		key: 'condominio-acessar-configuracoes',
		message: 'Sem permissão para acessar configurações do condomínio',
	},
	{
		label: 'Listar todos os condomínios ativos',
		key: 'condominios-listar-ativos',
		message: 'Sem permissão para listar condomínios ativos',
	},
	{
		label: 'Exibir dados de um condomínio',
		key: 'condominios-exibir-dados',
		message: 'Sem permissão para exibir os dados do condomínio',
	},
	{
		label: 'Vincular um condomínio a um departamento',
		key: 'condominios-vincular-departamento',
		message: 'Sem permissão para vincular departamentos a um condomínio',
	},
	{
		label: 'Listar todos as unidades',
		key: 'unidades-listar',
		message: 'Sem permissão para listar unidades',
	},
	{
		label: 'Listar todos as unidades ativas',
		key: 'unidades-listar-ativos',
		message: 'Sem permissão para listar unidades ativos',
	},
	{
		label: 'Exibir dados de um unidade',
		key: 'unidades-exibir-dados',
		message: 'Sem permissão para exibir as dados do unidade',
	},
	{
		label: 'Cadastrar novo departamento',
		key: 'departamentos-cadastrar',
		message: 'Sem permissão para criar departamentos',
	},
	{
		label: 'Listar todos os departamentos',
		key: 'departamentos-listar',
		message: 'Sem permissão para listar os departamentos',
	},
	{
		label: 'Listar departamentos ativos',
		key: 'departamentos-listar-ativos',
		message: 'Sem permissão para listar os departamentos',
	},
	{
		label: 'Exibir dados do departamento',
		key: 'departamentos-exibir-dados',
		message: 'Sem permissão para listar os dados dos departamentos',
	},
	{
		label: 'Atualizar dados do departamento',
		key: 'departamentos-atualizar-dados',
		message: 'Sem permissão para atualizar os dados dos departamentos',
	},
	{
		label: 'Desativar os departamentos',
		key: 'departamentos-desativar',
		message: 'Sem permissão para desativar os departamentos',
	},
	{
		label: 'Cadastrar modelos de notificações',
		key: 'layouts-notificacao-cadastrar',
		message: 'Sem permissão para cadastrar modelo',
	},
	{
		label: 'Listar todos modelos de notificações',
		key: 'layouts-notificacao-listar',
		message: 'Sem permissão para listar os modelos',
	},
	{
		label: 'Exibidar dados de um modelos de notificações',
		key: 'layouts-notificacao-exibir-dados',
		message: 'Sem permissão para exibir dados do modelo',
	},
	{
		label: 'Listar variáveis de layouts',
		key: 'layouts-notificacao-listar-constantes',
		message: 'Sem permissão para listar as variáveis',
	},
	{
		label: 'Exibir dados de configuração de notificação',
		key: 'setup-notificacoes-listar',
		message:
			'Sem permissão para listar os dados de configurações de notificações',
	},
	{
		label: 'Atualizar dados de configuração de notificação',
		key: 'setup-notificacoes-atualizar',
		message:
			'Sem permissão para atualizar os dados de configurações de notificações',
	},
	{
		label: 'Listar dados de setup do sistema',
		key: 'setup-sistema-listar',
		message:
			'Sem permissão para listar os dados de configurações do sistema',
	},
	{
		label: 'Atualizar dados de setup do sistema',
		key: 'setup-sistema-atualizar',
		message:
			'Sem permissão para atualizar os dados de configurações do sistema',
	},
	{
		label: 'Listar todos os cargos',
		key: 'cargos-listar',
		message: 'Sem permissão para listar os cargos',
	},
	{
		label: 'Listar cargos ativos',
		key: 'cargos-listar-ativos',
		message: 'Sem permissão para listar os cargos',
	},
	{
		label: 'Exibir dados do departamento',
		key: 'cargos-exibir-dados',
		message: 'Sem permissão para listar os dados dos cargos',
	},
	{
		label: 'Atualizar dados do departamento',
		key: 'cargos-atualizar-dados',
		message: 'Sem permissão para atualizar os dados dos cargos',
	},
];
