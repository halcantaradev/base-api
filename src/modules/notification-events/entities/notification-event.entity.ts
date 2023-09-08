import { ApiProperty } from '@nestjs/swagger';

export class NotificationEvent {
	@ApiProperty({
		description: 'Título da notificação',
		example: 'Título de teste',
		required: true,
	})
	titulo: string;

	@ApiProperty({
		description: 'Conteúdo da notificação',
		example: 'Conteúdo de teste',
		required: true,
	})
	conteudo: string;

	@ApiProperty({
		description: 'Usuário de destino da notificação',
		example: 1,
		required: true,
	})
	usuario_id: number;

	@ApiProperty({
		description: 'Empresa do usuário de destino da notificação',
		example: 1,
		required: true,
	})
	empresa_id: number;

	@ApiProperty({
		description: 'Dados da notificação',
		example: 'Qualquer coisa',
		required: true,
	})
	data?: any;

	@ApiProperty({
		description: 'Rota da notificação',
		example: 'rota/teste',
		required: true,
	})
	rota?: string;

	@ApiProperty({
		description: 'Status de leitura da notificação',
		example: true,
		required: true,
	})
	lida: boolean;
}
