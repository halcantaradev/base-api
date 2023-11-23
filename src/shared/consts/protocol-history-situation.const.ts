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
	static NAO_RETORNADO = 14;
	static ESTORNO_BAIXA = 15;
	static MALOTE_IMPRESSO = 16;
	static ESTORNO_NAO_RETORNADO = 17;

	static DESCRICAO = {
		1: 'Adicionado no protocolo',
		2: 'Enviado junto ao protocolo',
		3: 'Aceito no protocolo',
		4: 'Rejeitado no protocolo',
		5: 'Aceite estornado no protocolo',
		6: 'Atualizado no protocolo',
		7: 'Excluído no protocolo',
		8: 'Impresso no protocolo',
		9: 'Enviado para a fila',
		10: 'Removido da fila',
		11: 'Enviado para o malote',
		12: 'Removido do malote',
		13: 'Baixado no malote',
		14: 'Não recebido no malote',
		15: 'Baixa estornada no malote',
		16: 'Impresso no malote',
		17: 'Não recebimento estornado no malote',
	};

	static COR = {
		1: 'green',
		2: 'blue',
		3: 'green',
		4: 'red',
		5: 'blue',
		6: 'blue',
		7: 'red',
		8: 'blue',
		9: 'blue',
		10: 'blue',
		11: 'blue',
		12: 'blue',
		13: 'green',
		14: 'red',
		15: 'red',
		16: 'blue',
		17: 'red',
	};

	static ICONE = {
		1: 'plus-circle',
		2: 'delivered-procedure',
		3: 'check-circle',
		4: 'close-circle',
		5: 'rollback',
		6: 'edit',
		7: 'delete',
		8: 'printer',
		9: 'schedule',
		10: 'rollback',
		11: 'delivered-procedure',
		12: 'rollback',
		13: 'safety',
		14: 'issues-close',
		15: 'rollback',
		16: 'printer',
		17: 'rollback',
	};
}
