import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class CreateDepartmentDto {
	@ApiProperty({
		description: 'Nome do departamento',
		example: 'Departamento Teste',
		required: true,
	})
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um nome válido.',
	})
	@IsNotEmpty({
		message: 'O campo nome é obrigatório. Por favor, forneça um nome.',
	})
	nome: string;

	@ApiProperty({
		description: 'Departamento é um NAC',
		example: true,
		required: true,
	})
	@IsOptional()
	@Validate(IsBooleanType, {
		message:
			'O campo NAC informado não é válido. Por favor, forneça uma indicação válida.',
	})
	@Transform(({ value }) => {
		if (value === null) return null;

		return ['true', '1', true, 1].includes(value);
	})
	nac: boolean;
}
