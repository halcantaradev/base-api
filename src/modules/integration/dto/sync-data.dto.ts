import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SyncDataDto {
	@ApiProperty({
		description: 'Nome do departamento',
		example: 'condominio',
		required: true,
	})
	@IsString({
		message: 'O campo nome informado não é válido.',
	})
	@IsNotEmpty({
		message: 'O campo tipo é obrigatório.',
	})
	tipo: '' | 'unidade';

	@ApiProperty({
		description: 'Nome do departamento',
		example: {},
		required: true,
	})
	@IsString({
		message: 'O campo data informado não é válido.',
	})
	@IsNotEmpty({
		message: 'O campo data é obrigatório.',
	})
	data: any;

	@ApiProperty({
		description: 'Nome do departamento',
		example: {},
		required: true,
	})
	@IsString({
		message: 'O campo payload informado não é válido.',
	})
	@IsNotEmpty({
		message: 'O campo payload é obrigatório.',
	})
	payload: any;
}
