import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FilesOrigin } from '../consts/file-origin.const';

export class File {
	@ApiProperty({
		description: 'Id do arquivo',
		example: 1,
		readOnly: true,
	})
	@Type(() => Number)
	id: number;

	@ApiProperty({
		description: 'URL do arquivo',
		example: 'https://exemplo.com',
		readOnly: true,
	})
	url: string;

	@ApiProperty({
		description: 'Nome do arquivo',
		example: 'Nome Teste',
		readOnly: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Id do arquivo',
		example: Object.values(FilesOrigin).filter(
			(value) => typeof value === 'number',
		),
		readOnly: true,
	})
	@Type(() => Number)
	origem: number;

	@ApiProperty({
		description: 'Descrição do arquivo',
		example: 'Descrição Teste',
		readOnly: true,
	})
	descricao?: string;

	@ApiProperty({
		description: 'Tipo do arquivo',
		example: 'pdf',
		readOnly: true,
	})
	tipo: string;

	@ApiProperty({
		description: 'Id de referencia do arquivo',
		example: 1,
		readOnly: true,
	})
	@Type(() => Number)
	referencia_id: number;

	@ApiProperty({
		description: 'Identifica se o arquivo está ativo',
		example: true,
		readOnly: true,
	})
	ativo: boolean;

	@ApiProperty({
		description: 'Data de criação do arquivo',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	created_at: Date;

	@ApiProperty({
		description: 'Data da ultima atualização do arquivo',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	updated_at: Date;
}
