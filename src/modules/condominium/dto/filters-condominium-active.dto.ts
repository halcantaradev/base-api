import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators';

export class FiltersCondominiumActiveDto {
	@ApiProperty({
		description: 'Departamentos do condomínio',
		example: [1, 2],
		required: false,
	})
	@IsInt({
		message:
			'O campo departamentos informado não é válido. Por favor, forneça um departamento válido.',
		each: true,
	})
	@IsOptional()
	departamentos_ids?: number[];

	@ApiProperty({
		description: 'Incluir a empresa na listagem',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo incluir empresa informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	incluir_empresa?: boolean;
}
