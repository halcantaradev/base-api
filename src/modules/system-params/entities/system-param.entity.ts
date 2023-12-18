import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class SystemParam
	implements Prisma.ParametroSistemaUncheckedCreateInput
{
	@ApiProperty({
		description: 'Id do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Id da empresa',
		example: 1,
		required: true,
		readOnly: true,
	})
	empresa_id: number;

	@ApiProperty({
		description: 'Label do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	label: string;

	@ApiProperty({
		description: 'Descrição do parâmetro',
		example: 1,
		required: false,
		readOnly: true,
	})
	descricao?: string;

	@ApiProperty({
		description: 'Chave do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	chave: string;

	@ApiProperty({
		description: 'Valor do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	valor: string;

	@ApiProperty({
		description: 'Tipo do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	tipo: string;

	@ApiProperty({
		description: 'Se o parâmetro está ativo',
		example: 1,
		required: true,
		readOnly: true,
	})
	ativo: boolean;

	@ApiProperty({
		description: 'Data de criação do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	created_at?: string | Date;

	@ApiProperty({
		description: 'Data de atualizão do parâmetro',
		example: 1,
		required: true,
		readOnly: true,
	})
	updated_at?: string | Date;
}
