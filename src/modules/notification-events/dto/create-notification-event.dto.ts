export class CreateNotificationEventDto {
	usuario_id: number;
	empresa_id: number;
	titulo: string;
	conteudo: string;
	rota?: string;
	data?: any;
}
