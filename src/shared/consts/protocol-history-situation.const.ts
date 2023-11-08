export class ProtocolHistorySituation {
	static CRIADO = 1;
	static ENVIADO = 2;
	static ACEITO = 3;
	static REJEITADO = 4;
	static ESTORNO_ACEITE = 5;
	static ATUALIZADO = 6;
	static EXCLUIDO = 7;
	static PROTOCOLO_IMPRESSO = 8;
	static ENVIADO_FILA = 9;
	static ESTORNO_FILA = 10;
	static ENVIADO_MALOTE = 11;
	static ESTORNO_MALOTE = 12;
	static BAIXADO = 13;
	static NAO_RECEBIDO = 14;
	static ESTORNO_BAIXA = 15;
	static MALOTE_IMPRESSO = 16;

	static DESCRICAO = {
		1: 'Criado',
		2: 'Enviado',
		3: 'Aceito',
		4: 'Rejeitado',
		5: 'Aceite estornado',
		6: 'Atualizado',
		7: 'Excluido',
		8: 'Impresso no módulo de protocolos',
		9: 'Enviado para a fila',
		10: 'Envio para a fila estornado',
		11: 'Enviado para o malote',
		12: 'Envio para o malote estornado',
		13: 'Baixado',
		14: 'Não recebido',
		15: 'Baixa Estornada',
		16: 'Impresso no módulo de malotes',
	};
}
