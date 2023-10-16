import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, Validate, IsInt } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators';

export class FiltersActiveDepartmentDto {
	@ApiProperty({
		description: 'Filtro por nome do departamento',
		example: '001',
		required: false,
	})
	@IsString({
		message:
			'O campo busca informado não é válido. Por favor, forneça uma busca válida.',
	})
	@IsOptional()
	busca?: string;

	@ApiProperty({
		description: 'Filtro por nome ou código do departamento',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo usuario_id informado não é válido. Por favor, forneça um usuario_id válido.',
	})
	@Type(() => Number)
	@IsOptional()
	usuario_id?: number;

	@ApiProperty({
		description: 'Departamento é externo',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo externo informado não é válido. Por favor, forneça uma informação valida.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	externo?: boolean;
}
