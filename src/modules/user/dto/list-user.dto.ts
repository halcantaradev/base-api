import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class ListUserDto {
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
		description: 'Status do usuário',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo?: boolean;
}
