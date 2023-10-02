import { ApiProperty } from '@nestjs/swagger';

export class QueueGeneratePackage {
	@ApiProperty({
		description: 'Id da fila',
		example: 1,
		required: false,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Id do documento',
		example: 1,
		required: false,
		readOnly: true,
	})
	documento_id: number;

	@ApiProperty({
		description: 'Status da fila',
		example: true,
		required: false,
		readOnly: true,
	})
	ativo: boolean;

	@ApiProperty({
		description: 'Status de exclusão da fila',
		example: true,
		required: false,
		readOnly: true,
	})
	excluido: boolean;

	@ApiProperty({
		description: 'Data de criação da fila',
		example: new Date(),
		required: false,
		readOnly: true,
	})
	created_at: Date;

	@ApiProperty({
		description: 'Data de atualização da fila',
		example: new Date(),
		required: false,
		readOnly: true,
	})
	updated_at: Date;
}
