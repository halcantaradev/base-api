import { IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class FiltersSubsidiaryDto {
	@ApiProperty({
		description: 'Filtro por nome ou código da filial',
		example: '001',
		required: false,
	})
	@IsString({
		message:
			'O campo busca informado não é válido. Por favor, forneça um código ou nome de busca válido.',
	})
	@IsOptional()
	busca?: string;

	@ApiProperty({
		description: 'Status da filial',
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
