import { ApiProperty } from '@nestjs/swagger';

export class NotificationEvent {
	@ApiProperty({
		description: 'Título da notificação',
		example: 'Título de teste',
		required: true,
	})
	id: number;

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

	@ApiProperty({
		description: 'Data de criação da notificação',
		example: new Date(),
	})
	created_at: Date;

	@ApiProperty({
		description: 'Data de atualização da notificação',
		example: new Date(),
	})
	updated_at: Date;
}
