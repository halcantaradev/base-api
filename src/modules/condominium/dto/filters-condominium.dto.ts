import { IsDate, IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { FiltersCondominiumActiveDto } from './filters-condominium-active.dto';

export class FiltersCondominiumDto extends FiltersCondominiumActiveDto {
	@ApiProperty({
		description: 'Filtro por nome ou código do condomínio',
		example: '001',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo condominio informado não é válido. Por favor, forneça um código ou nome de condominio válido.',
	})
	condominio?: string;

	@ApiProperty({
		description: 'Filtro por endereço do condomínio',
		example: 'Av. Washington Soares, 31',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo endereço informado não é válido. Por favor, forneça um endereço válido.',
	})
	endereco?: string;

	@ApiProperty({
		description: 'Filtro por consultor do condomínio',
		example: [1, 2],
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo consultor informado não é válido. Por favor, forneça um consultor válido.',
		each: true,
	})
	@Type(() => Number)
	consultores_ids?: number[];

	@ApiProperty({
		description: 'Filtro por tipo de contrato do condomínio',
		example: [1, 2],
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo tipo de contrato informado não é válido. Por favor, forneça um tipo de contrato válido.',
		each: true,
	})
	@Type(() => Number)
	tipos_contrato_ids?: number[];

	@ApiProperty({
		description: 'Filtro por filial do condomínio',
		example: [1, 2],
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo filial informado não é válido. Por favor, forneça um filial válido.',
		each: true,
	})
	@Type(() => Number)
	filiais_ids?: number[];

	@ApiProperty({
		description: 'Filtro por tipo do condomínio',
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo tipo informado não é válido. Por favor, forneça um tipo válido.',
	})
	@Type(() => Number)
	categoria_id?: number;

	@ApiProperty({
		description: 'Filtro inicial por data de criação',
		example: '2023-01-01',
		required: false,
	})
	@IsOptional()
	@IsDate({
		message:
			'O campo data inicial informado não é válido. Por favor, forneça uma data inicial válida.',
	})
	@Type(() => Date)
	data_inicio?: Date;

	@ApiProperty({
		description: 'Filtro final por data de criação',
		example: '2023-01-01',
		required: false,
	})
	@IsOptional()
	@IsDate({
		message:
			'O campo data final informado não é válido. Por favor, forneça uma data final válida.',
	})
	@Type(() => Date)
	data_fim?: Date;

	@ApiProperty({
		description: 'Status do condomínio',
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
