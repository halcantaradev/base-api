import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators';

export class FiltersSearchVirtualPackageDto {
	@ApiProperty({
		description: 'Filtro por código do malote',
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo código informado não é válido. Por favor, forneça um código válido.',
	})
	codigo?: number;

	@ApiProperty({
		description: 'Filtro por condomínio do malote',
		example: [1, 2],
		required: false,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message:
			'O campo condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	condominios_ids?: number[];

	@ApiProperty({
		description: 'Filtro de data',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{
			each: true,
			message: 'Data inválida, por favor, informe uma data válida',
		},
	)
	data_filtro?: string[];

	@ApiProperty({
		description: 'Filtro por malote físico do malote',
		example: '0001',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo malote físico informado não é válido. Por favor, forneça um malote físico válido.',
	})
	codigo_malote_fisico?: string;

	@ApiProperty({
		description: 'Situação do malote',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo situação informado não é válido. Por favor, forneça uma situação válida.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	finalizado?: boolean;

	@ApiProperty({
		description: 'Filtro por usuário',
		example: [1, 2],
		required: false,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message:
			'O campo de usuário informado não é válido. Por favor, forneça um usuário válido.',
	})
	usuario_ids?: number[];

	@ApiProperty({
		description: 'Filtro por tipo de data',
		example: 1,
		required: false,
	})
	@IsNotEmpty({
		message: 'Informe o tipo de data que deseja filtrar',
	})
	@IsInt({
		message:
			'O campo filtrar data por informado não é válido. Por favor, forneça um filtro válido.',
	})
	tipo_data: number;
}
