export const SystemParamsList: {
	label: string;
	descricao?: string;
	chave: string;
	valor: string;
	tipo: string;
	ativo?: boolean;
}[] = [
	{
		label: 'Ativar chat do sistema',
		descricao: 'Chat para comunicação na empresa',
		chave: 'usa-rocket-chat',
		valor: 'true',
		tipo: 'checkbox',
		ativo: true,
	},
];
