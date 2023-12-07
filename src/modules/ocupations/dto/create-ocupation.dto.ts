import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class CreateOcupationDto {
	@ApiProperty({
		description: 'Nome do cargo',
		example: 'cargo Teste',
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
		description: 'Status do cargo',
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

	@ApiProperty({
		description: 'Perfil do cargo',
		example: true,
		required: false,
	})
	@IsInt({
		message:
			'O campo perfil informado não é válido. Por favor, forneça um perfil válido.',
	})
	@IsOptional()
	perfil?: number;
}
