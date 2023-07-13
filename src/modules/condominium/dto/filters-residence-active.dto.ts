import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FiltersResidenceActiveDto {
	@ApiProperty({
		description: 'Condomínio da unidade',
		example: [1],
		isArray: true,
		required: false,
	})
	@IsNotEmpty({
		message:
			'O campo de condomínio é obrigatório. Por favor, forneça um condomínio.',
	})
	@IsInt({
		message:
			'O campo de condomínio informado não é válido. Por favor, forneça um condomínio válido.',
		each: true,
	})
	@Type(() => Number)
	condominios_ids: number[];

	@ApiProperty({
		description: 'Filtro por nome ou código da unidade',
		example: '001',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo de busca informado não é válido. Por favor, forneça um código ou nome de unidade válido.',
	})
	busca?: string;
}
