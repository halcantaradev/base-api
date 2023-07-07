import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class LayoutsNotification
	implements Prisma.LayoutsNotificacaoCreateWithoutEmpresaInput
{
	@ApiProperty({
		description: 'Id do layout',
		example: 1,
		required: false,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do modelo',
		example: 'Notificação padrão',
		required: true,
		readOnly: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Conteúdo do modelo em si',
		example: '<h1>Titúlo da notificação</h1>...',
		required: false,
		readOnly: true,
	})
	modelo: string;

	@ApiProperty({
		description: 'Se é modelo padrão do sistema',
		example: true,
		required: false,
		readOnly: true,
	})
	padrao?: boolean;

	@ApiProperty({
		description: 'Status do modelo no sistema',
		example: true,
		required: false,
		readOnly: true,
	})
	ativo?: boolean;

	@ApiProperty({
		description: 'Data da criação',
		example: '2023-01-01T23:59:59.000Z',
		required: false,
		readOnly: true,
	})
	created_at?: string | Date;

	@ApiProperty({
		description: 'Data de atualização',
		example: '2023-01-01T23:59:59.000Z',
		required: false,
		readOnly: true,
	})
	updated_at?: string | Date;
}
