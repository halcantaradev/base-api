import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

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
		description: 'Filial do departamento',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O campo filial informado não é válido. Por favor, forneça uma filial válido.',
	})
	@IsNotEmpty({
		message: 'O campo filial é obrigatório. Por favor, forneça uma filial.',
	})
	filial_id: number;

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
	@Transform(BooleanTransformHelper)
	nac: boolean;

	@ApiProperty({
		description: 'Departamento externo',
		example: true,
		required: true,
	})
	@IsOptional()
	@Validate(IsBooleanType, {
		message:
			'O campo externo informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	externo: boolean;
}
