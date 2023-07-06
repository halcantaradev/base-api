export const layoutConst: Array<{
	label: string;
	const: string;
	field: string;
}> = [
	{
		label: 'Data hora atual',
		const: '[DATA_ATUAL]',
		field: '{{data_atual}}',
	},
	{
		label: 'Data hora atual por extenso',
		const: '[DATA_ATUAL_EXTENSO]',
		field: '{{data_atual_extenso}}',
	},
	{
		label: 'Nome do condomínio',
		const: '[NOME_CONDOMINIO]',
		field: '{{nome_condominio}}',
	},
	{
		label: 'CNPJ do condomínio',
		const: '[CNPJ_CONDOMINIO]',
		field: '{{cnpj_condominio}}',
	},
	{
		label: 'Cidade do condomínio',
		const: '[CIDADE_CONDOMINIO]',
		field: '{{cidade_condominio}}',
	},
	{
		label: 'Endereço do condomínio',
		const: '[ENDERECO_CONDOMINIO]',
		field: '{{endereco_condominio}}',
	},
	{
		label: 'Bairro do condomínio',
		const: '[BAIRRO_CONDOMINIO]',
		field: '{{bairro_condominio}}',
	},
	{
		label: 'Nome do síndico',
		const: '[NOME_SINDICO]',
		field: '{{nome_sindico}}',
	},
	{
		label: 'Unidade',
		const: '[CODIGO_UNIDADE]',
		field: '{{codigo_unidade}}',
	},
	{
		label: 'Número da notificação',
		const: '[NUMERO_NOTIFICACAO]',
		field: '{{numero_notificacao}}',
	},
	{
		label: 'Data da infração',
		const: '[DATA_HORA_INFRACAO]',
		field: '{{data_infracao}}',
	},
	{
		label: 'Tipo do responsável notificado',
		const: '[TIPO_RESPONSAVEL_NOTIFICADO]',
		field: '{{tipo_responsavel_notificado}}',
	},
	{
		label: 'Responsável notificado',
		const: '[RESPONSAVEL_NOTIFICADO]',
		field: '{{responsavel_notificado}}',
	},
	{
		label: 'Texto padrão para notificação',
		const: '[TEXTO_PADRAO_NOTIFICACAO]',
		field: '{{texto_padrao_notificacao}}',
	},
	{
		label: 'Observação padrão para notificação do condomínio',
		const: '[OBSERVACAO_PADRAO_NOTIFICACAO_CONDOMINIO]',
		field: '{{observacao_padrao_notificacao_condominio}}',
	},
	{
		label: 'Sanção padrão',
		const: '[SANCAO_PADRAO]',
		field: '{{sancao_padrao}}',
	},
	{
		label: 'Detalhes da infração',
		const: '[DETALHES_INFRACAO]',
		field: '{{{detalhes_infracao}}}',
	},
	{
		label: 'Fundamentação legal',
		const: '[FUNDAMENTACAO_LEGAL]',
		field: '{{{fundamentacao_legal}}}',
	},
	{
		label: 'Tipo da notificação',
		const: '[TIPO_NOTIFICACAO]',
		field: '{{{tipo_notificacao}}}',
	},
	{
		label: 'Observações da notificação',
		const: '[OBSERVACOES_NOTIFICACAO]',
		field: '{{{observacoes_notificacao}}}',
	},
];
