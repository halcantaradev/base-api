import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';
import { IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
	@IsOptional()
	nome?: string;

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
		return ['true', '1'].includes(value);
	})
	@IsOptional()
	ativo?: boolean;
}
