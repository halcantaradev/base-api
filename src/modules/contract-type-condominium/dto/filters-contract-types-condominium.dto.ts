import { IsOptional, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

import { FiltersContractTypesCondominiumActiveDto } from './filters-contract-types-condominium-active.dto';

export class FiltersContractTypesCondominiumDto extends FiltersContractTypesCondominiumActiveDto {
	@ApiProperty({
		description: 'Status do tipo do contrato',
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
