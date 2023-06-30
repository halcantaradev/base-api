import { IsOptional, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class FiltersDepartmentDto {
	@ApiProperty({
		description: 'Status do departamento',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(({ value }) => {
		return ['true', '1', true, 1].includes(value);
	})
	@IsOptional()
	ativo: boolean;
}
