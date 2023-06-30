import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';
import { DepartmentExists } from '../validators';

export class LinkDepartamentDto {
	@ApiProperty({
		description: 'Departamento que será vinculado',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo departamento é obrigatório. Por favor, forneça um departamento.',
	})
	@IsInt({
		message:
			'O campo departamento informado não é válido. Por favor, forneça um departamento válido.',
	})
	@Type(() => Number)
	@Validate(DepartmentExists)
	departamento: number;
}
