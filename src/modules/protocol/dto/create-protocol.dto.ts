import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import {
	UserExists,
	IsBooleanType,
	DepartmentExists,
} from 'src/shared/validators';

export class CreateProtocolDto {
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
		description: 'Identifica se o protocolo retorna malote vazio',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo retornar malote vazio informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	retorna_malote_vazio?: boolean;

	@ApiProperty({
		description: 'Identifica se o protocolo é um protocolo malote',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo protocolo malote informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	protocolo_malote?: boolean;
}
