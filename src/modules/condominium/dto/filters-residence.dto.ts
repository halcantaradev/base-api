import { IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { FiltersResidenceActiveDto } from './filters-residence-active.dto';

export class FiltersResidenceDto extends FiltersResidenceActiveDto {
	@ApiProperty({
		description: 'Id do condomínio',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo de condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	@IsOptional()
	condominio_id?: number;

	@ApiProperty({
		description: 'Busca por nome o numero da unidade',
		example: 'Numero da unidade',
		required: false,
	})
	@Validate(IsOptional(), {
		message:
			'O campo busca informado não é válido. Por favor, forneça um busca válido.',
	})
	@IsString({
		message:
			'O campo busca informado não é válido. Por favor, forneça um valor.',
	})
	@IsOptional()
	busca?: string;

	@ApiProperty({
		description: 'Status da unidade',
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
