import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FiltersCondominiumDto {
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
	condominio: string;

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
	endereco: string;

	@ApiProperty({
		description: 'Filtro por consultor do condomínio',
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo consultor informado não é válido. Por favor, forneça um consultor válido.',
	})
	@Type(() => Number)
	consultor_id: number;

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
	categoria_id: number;

	@ApiProperty({
		description: 'Filtro inicial por data de criação',
		example: '2023-01-01',
		required: true,
	})
	@IsOptional()
	@IsDate({
		message:
			'O campo data inicial informado não é válido. Por favor, forneça uma data inicial válida.',
	})
	@Type(() => Date)
	data_inicio: Date;

	@ApiProperty({
		description: 'Filtro final por data de criação',
		example: '2023-01-01',
		required: true,
	})
	@IsOptional()
	@IsDate({
		message:
			'O campo data final informado não é válido. Por favor, forneça uma data final válida.',
	})
	@Type(() => Date)
	data_fim: Date;
}
