export const permissionslist: Array<{
	label: string;
	module: string;
	key: string;
	message: string;
	active?: boolean;
}> = [
	{
		label: 'Listar todos os usuários',
		module: 'Usuários',
		key: 'usuarios-listar-todos',
		message: 'Sem permissão para listar todos os usuários',
	},
	{
		label: 'Gerar relatórios de usuários',
		module: 'Usuários',
		key: 'usuario-relatorios',
		message: 'Sem permissão para gerar relatório de usuários',
	},
	{
		label: 'Exibir dados do usuário',
		module: 'Usuários',
		key: 'usuarios-exibir-dados',
		message: 'Sem permissão para listar dados do usuário',
	},
	{
		label: 'Cadastrar usuários',
		module: 'Usuários',
		key: 'usuarios-cadastrar',
		message: 'Sem permissão para cadastrar usuários',
	},
	{
		label: 'Atualizar dados do usuário',
		module: 'Usuários',
		key: 'usuarios-atualizar-dados',
		message: 'Sem permissão para atualizar dados do usuário',
	},
	{
		label: 'Listar condomínios limitados ao usuário',
		module: 'Usuários',
		key: 'usuarios-listar-condominios-limitados',
		message:
			'Sem permissão para listar os condomínios limitados do usuário',
	},
	{
		label: 'Limitar acesso do usuário aos condomínios',
		module: 'Usuários',
		key: 'usuarios-limitar-acesso-condominios',
		message: 'Sem permissão para limitar acesso aos condomínios',
	},
	{
		label: 'Listar permissões',
		module: 'Permissões',
		key: 'permissoes-listar',
		message: 'Sem permissão para listar permissões',
	},
	{
		label: 'Listar permissões do cargo',
		module: 'Permissões',
		key: 'permissoes-cargos-listar',
		message: 'Sem permissão para listar as permissões do cargo',
	},
	{
		label: 'Conceder permissões aos cargos',
		module: 'Permissões',
		key: 'permissoes-cargos-conceder',
		message: 'Sem permissão para conceder permissão ao cargo',
	},
	{
		label: 'Listar permissões do usuário',
		module: 'Permissões',
		key: 'permissoes-usuarios-listar',
		message: 'Sem permissão para listar as permissões do usuário',
	},
	{
		label: 'Conceder permissões aos usuários',
		module: 'Permissões',
		key: 'permissoes-usuarios-conceder',
		message: 'Sem permissão para conceder permissão ao usuário',
	},
	{
		label: 'Listar usuários ativos',
		module: 'Usuários',
		key: 'usuarios-listar-ativos',
		message: 'Sem permissão para listar usuários ativos',
	},
	{
		label: 'Cadastrar notificação',
		module: 'Notificação',
		key: 'notificacoes-cadastrar',
		message: 'Sem permissão para cadastrar notificação',
	},
	{
		label: 'Listar  notificações',
		module: 'Notificação',
		key: 'notificacoes-listar',
		message: 'Sem permissão para listar notificação',
	},
	{
		label: 'Exibir dados de uma notificação',
		module: 'Notificação',
		key: 'notificacoes-exibir-dados',
		message: 'Sem permissão para exibir dados da notificação',
	},
	{
		label: 'Atualizar dados da notificação',
		module: 'Notificação',
		key: 'notificacoes-atualizar-dados',
		message: 'Sem permissão para atualizar notificação',
	},
	{
		label: 'Excluir notificações',
		module: 'Notificação',
		key: 'notificacoes-remover',
		message: 'Sem permissão para excluir a notificação',
	},
	{
		label: 'Gerar relatórios de notificações',
		module: 'Notificação',
		key: 'notificacoes-relatorios-condominio',
		message: 'Sem permissão para gerar relatórios de notificações',
	},
	{
		label: 'Cadastrar tipos de infrações',
		module: 'Infração',
		key: 'notificacoes-infracoes-cadastrar',
		message: 'Sem permissão para cadastrar tipos de infrações',
	},
	{
		label: 'Listar tipos de infrações',
		module: 'Infração',
		key: 'notificacoes-infracoes-listar',
		message: 'Sem permissão para listar tipos de infrações',
	},
	{
		label: 'Exibir dados do tipo de infração',
		module: 'Infração',
		key: 'notificacoes-infracoes-exibir-dados',
		message: 'Sem permissão para exibir dados do tipo de infração',
	},
	{
		label: 'Atualizar dados do tipo de infração',
		module: 'Infração',
		key: 'notificacoes-infracoes-atualizar-dados',
		message: 'Sem permissão para atualizar o tipo de infração',
	},
	{
		label: 'Listar todos os condomínios',
		module: 'Condomínios',
		key: 'condominios-listar',
		message: 'Sem permissão para listar condomínios',
	},
	{
		label: 'Acessar configurações do condomínio',
		module: 'Condomínios',
		key: 'condominio-acessar-configuracoes',
		message: 'Sem permissão para acessar configurações do condomínio',
	},
	{
		label: 'Listar todos os condomínios ativos',
		module: 'Condomínios',
		key: 'condominios-listar-ativos',
		message: 'Sem permissão para listar condomínios ativos',
	},
	{
		label: 'Exibir dados de um condomínio',
		module: 'Condomínios',
		key: 'condominios-exibir-dados',
		message: 'Sem permissão para exibir os dados do condomínio',
	},
	{
		label: 'Vincular um condomínio a um departamento',
		module: 'Condomínios',
		key: 'condominios-vincular-departamento',
		message: 'Sem permissão para vincular departamentos a um condomínio',
	},
	{
		label: 'Vincular um tipo de contrato a um condomínio',
		module: 'Condomínios',
		key: 'condominios-vincular-tipo-contrato',
		message:
			'Sem permissão para vincular tipos de contrato a um condomínio',
	},
	{
		label: 'Gerar relatórios de condomínios',
		module: 'Condomínios',
		key: 'condominios-relatorios',
		message: 'Sem permissão para gerar relatório de condomínios',
	},
	{
		label: 'Listar todos as unidades',
		module: 'Unidades',
		key: 'unidades-listar',
		message: 'Sem permissão para listar unidades',
	},
	{
		label: 'Listar todos as unidades ativas',
		module: 'Unidades',
		key: 'unidades-listar-ativos',
		message: 'Sem permissão para listar unidades ativos',
	},
	{
		label: 'Exibir dados de um unidade',
		module: 'Unidades',
		key: 'unidades-exibir-dados',
		message: 'Sem permissão para exibir as dados do unidade',
	},
	{
		label: 'Cadastrar novo departamento',
		module: 'Departamentos',
		key: 'departamentos-cadastrar',
		message: 'Sem permissão para criar departamentos',
	},
	{
		label: 'Listar todos os departamentos',
		module: 'Departamentos',
		key: 'departamentos-listar',
		message: 'Sem permissão para listar os departamentos',
	},
	{
		label: 'Listar departamentos ativos',
		module: 'Departamentos',
		key: 'departamentos-listar-ativos',
		message: 'Sem permissão para listar os departamentos',
	},
	{
		label: 'Exibir dados do departamento',
		module: 'Departamentos',
		key: 'departamentos-exibir-dados',
		message: 'Sem permissão para listar os dados dos departamentos',
	},
	{
		label: 'Atualizar dados do departamento',
		module: 'Departamentos',
		key: 'departamentos-atualizar-dados',
		message: 'Sem permissão para atualizar os dados dos departamentos',
	},
	{
		label: 'Excluir departamentos',
		module: 'Departamentos',
		key: 'departamentos-remover',
		message: 'Sem permissão para excluir departamentos',
	},
	{
		label: 'Cadastrar modelos de notificações',
		module: 'Notificação',
		key: 'layouts-notificacao-cadastrar',
		message: 'Sem permissão para cadastrar modelo',
	},
	{
		label: 'Atualizar modelos de notificações',
		module: 'Notificação',
		key: 'layouts-notificacao-atualizar',
		message: 'Sem permissão para atualizar modelo',
	},
	{
		label: 'Listar todos modelos de notificações',
		module: 'Notificação',
		key: 'layouts-notificacao-listar',
		message: 'Sem permissão para listar os modelos',
	},
	{
		label: 'Listar todos modelos de notificações ativos',
		module: 'Notificação',
		key: 'layouts-notificacao-listar-ativos',
		message: 'Sem permissão para listar os modelos ativos',
	},
	{
		label: 'Exibidar dados de um modelos de notificações',
		module: 'Notificação',
		key: 'layouts-notificacao-exibir-dados',
		message: 'Sem permissão para exibir dados do modelo',
	},
	{
		label: 'Listar variáveis de layouts',
		module: 'Notificação',
		key: 'layouts-notificacao-listar-constantes',
		message: 'Sem permissão para listar as variáveis',
	},
	{
		label: 'Exibir dados de configuração de notificação',
		module: 'Notificação',
		key: 'setup-notificacoes-listar',
		message:
			'Sem permissão para listar os dados de configurações de notificações',
	},
	{
		label: 'Atualizar dados de configuração de notificação',
		module: 'Notificação',
		key: 'setup-notificacoes-atualizar',
		message:
			'Sem permissão para atualizar os dados de configurações de notificações',
	},
	{
		label: 'Listar dados de setup do sistema',
		module: 'Sistema',
		key: 'setup-sistema-listar',
		message:
			'Sem permissão para listar os dados de configurações do sistema',
	},
	{
		label: 'Atualizar dados de setup do sistema',
		module: 'Sistema',
		key: 'setup-sistema-atualizar',
		message:
			'Sem permissão para atualizar os dados de configurações do sistema',
	},
	{
		label: 'Listar todos os cargos',
		module: 'Cargos',
		key: 'cargos-listar',
		message: 'Sem permissão para listar os cargos',
	},
	{
		label: 'Listar cargos ativos',
		module: 'Cargos',
		key: 'cargos-listar-ativos',
		message: 'Sem permissão para listar os cargos',
	},
	{
		label: 'Exibir dados do cargo',
		module: 'Cargos',
		key: 'cargos-exibir-dados',
		message: 'Sem permissão para listar os dados dos cargos',
	},
	{
		label: 'Atualizar dados do cargo',
		module: 'Cargos',
		key: 'cargos-atualizar-dados',
		message: 'Sem permissão para atualizar os dados dos cargos',
	},
	{
		label: 'Cadastrar cargos',
		module: 'Cargos',
		key: 'cargos-cadastrar',
		message: 'Sem permissão para cadastrar cargos',
	},
	{
		label: 'Cadastar filiais',
		module: 'Filiais',
		key: 'filiais-cadastrar',
		message: 'Sem permissão para cadastrar filiais',
	},
	{
		label: 'Listar todas as filiais',
		module: 'Filiais',
		key: 'filiais-listar',
		message: 'Sem permissão para listar as filiais',
	},
	{
		label: 'Listar todas as filiais ativas',
		module: 'Filiais',
		key: 'filiais-listar-ativas',
		message: 'Sem permissão para listar as filiais ativas',
	},
	{
		label: 'Exibir dados da filial',
		module: 'Filiais',
		key: 'filiais-exibir-dados',
		message: 'Sem permissão para listar os dados da filial',
	},
	{
		label: 'Atualizar dados da filial',
		module: 'Filiais',
		key: 'filiais-atualizar-dados',
		message: 'Sem permissão para atualizar os dados da filial',
	},
	{
		label: 'Cadastrar tipos de contratos',
		module: 'Tipos de Contratos',
		key: 'tipo-contrato-cadastrar',
		message: 'Sem permissão para cadastrar os dados do tipo de contrato',
	},
	{
		label: 'Atualizar tipos de contratos',
		module: 'Tipos de Contratos',
		key: 'tipo-contrato-atualizar',
		message: 'Sem permissão para atualizar os dados do tipo de contrato',
	},
	{
		label: 'Listar tipos de contratos',
		module: 'Tipos de Contratos',
		key: 'tipo-contrato-listar',
		message: 'Sem permissão para listar os dados do tipo de contrato',
	},
	{
		label: 'Listar tipos de contratos ativos',
		module: 'Tipos de Contratos',
		key: 'tipo-contrato-listar-ativos',
		message:
			'Sem permissão para listar os dados do tipo de contrato ativos',
	},
	{
		label: 'Visualizar dados de tipo de contrato',
		module: 'Tipos de Contratos',
		key: 'tipo-contrato-exibir-dados',
		message: 'Sem permissão para ver os dados do tipo de contrato',
	},
	{
		label: 'Listar integrações ativas',
		module: 'Integração',
		key: 'integracoes-listar-ativas',
		message: 'Sem permissão para listar integrações ativas',
		active: false,
	},
	{
		label: 'Gerar token de integração',
		module: 'Integração',
		key: 'integracoes-gerar-token',
		message: 'Sem permissão para gerar tokens de integrações',
		active: false,
	},
	{
		label: 'Cadastrar protocolo',
		module: 'Protocolos',
		key: 'protocolos-cadastrar',
		message: 'Sem permissão para criar protocolos',
	},
	{
		label: 'Listar protocolos',
		module: 'Protocolos',
		key: 'protocolos-listar',
		message: 'Sem permissão para listar protocolos',
	},
	{
		label: 'Buscar protocolos',
		module: 'Protocolos',
		key: 'protocolos-buscar',
		message: 'Sem permissão para buscar protocolos',
	},
	{
		label: 'Visualizar dados de protocolos',
		module: 'Protocolos',
		key: 'protocolos-exibir-dados',
		message: 'Sem permissão para exibir os dados do protocolo',
	},
	{
		label: 'Atualizar dados do protocolo',
		module: 'Protocolos',
		key: 'protocolos-atualizar-dados',
		message: 'Sem permissão para atualizar protocolo',
	},
	{
		label: 'Cadastrar tipos de documentos',
		module: 'Documentos',
		key: 'tipos-documentos-cadastrar',
		message: 'Sem permissão para cadastrar tipos de documentos',
	},
	{
		label: 'Atualizar tipos de documentos',
		module: 'Documentos',
		key: 'tipos-documentos-atualizar',
		message: 'Sem permissão para atualizar tipos de documentos',
	},
	{
		label: 'Listar tipos de documentos',
		module: 'Documentos',
		key: 'tipos-documentos-listar',
		message: 'Sem permissão para listar tipos de documentos',
	},
	{
		label: 'Remover tipo de documento',
		module: 'Documentos',
		key: 'tipos-documentos-remover',
		message: 'Sem permissão para remover tipos de documentos',
	},
	{
		label: 'Visualizar dados do tipo de documento',
		module: 'Documentos',
		key: 'tipos-documentos-exibir-dados',
		message: 'Sem permissão para exibir dados do tipo de documento',
	},
	{
		label: 'Listar tipos de documentos ativos',
		module: 'Documentos',
		key: 'tipos-documentos-listar-ativos',
		message: 'Sem permissão para listar tipos de documentos',
	},
];
