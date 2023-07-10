import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ListUserActiveDto {
	@ApiProperty({
		description: 'Campo para filtragem de usuário',
		example: 'usuario@exemplo.com',
		required: false,
	})
	@IsString({
		message:
			'O campo buca informado não é válido. Por favor, forneça uma buca válida',
	})
	@IsOptional()
	busca?: string;

	@ApiProperty({
		description: 'Cargos do usuário',
		example: [1, 2],
		isArray: true,
		required: false,
	})
	@IsInt({
		message:
			'O campo cargos informado não é válido. Por favor, forneça um cargo válido.',
		each: true,
	})
	@IsOptional()
	cargos?: number[];

	@ApiProperty({
		description: 'Departamentos do usuário',
		example: [1, 2],
		required: false,
	})
	@IsInt({
		message:
			'O campo departamentos informado não é válido. Por favor, forneça um departamento válido.',
		each: true,
	})
	@IsOptional()
	departamentos?: number[];
}
