import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { FilterInfractionActiveDto } from './filter-infraction-active.dto';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { Transform } from 'class-transformer';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class FilterInfractionDto extends FilterInfractionActiveDto {
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
