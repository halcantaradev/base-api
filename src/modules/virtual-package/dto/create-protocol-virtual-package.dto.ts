import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { DepartmentExists, UserExists } from 'src/shared/validators';

export class CreateProtocolVirtualPackageDto {
	@ApiProperty({
		description: 'Tipo do protocolo',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo tipo é obrigatório. Por favor, forneça um tipo.',
	})
	@IsInt({
		message:
			'O campo tipo informado não é válido. Por favor, forneça um tipo válido.',
	})
	@Type(() => Number)
	tipo: 1 | 2;

	@ApiProperty({
		description: 'Departamento de destino do protocolo',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo departamento de destino é obrigatório. Por favor, forneça um departamento.',
	})
	@IsInt({
		message:
			'O campo departamento de destino informado não é válido. Por favor, forneça um departamento válido.',
	})
	@Type(() => Number)
	@Validate(DepartmentExists)
	destino_departamento_id: number;

	@ApiProperty({
		description: 'Departamento de origem do protocolo',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo departamento de origem é obrigatório. Por favor, forneça um departamento.',
	})
	@IsInt({
		message:
			'O campo departamento de origem informado não é válido. Por favor, forneça um departamento válido.',
	})
	@Type(() => Number)
	@Validate(DepartmentExists)
	origem_departamento_id: number;

	@ApiProperty({
		description: 'Usuário de destino do protocolo',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O usuário de destino informado não é válido. Por favor, forneça um usuário válido.',
	})
	@Type(() => Number)
	@Validate(UserExists)
	@IsOptional()
	destino_usuario_id: number;

	@ApiProperty({
		description: 'Id dos malotes',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'Os malotes informado não são válidos. Por favor, forneça malotes válidos.',
	})
	@IsNotEmpty({
		message:
			'O campo de malotes é obrigatório. Por favor, forneça um malote.',
	})
	malotes_virtuais_ids: number[];
}
