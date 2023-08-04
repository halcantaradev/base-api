import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FiltersContractTypesCondominiumActiveDto {
	@ApiProperty({
		description: 'Filtro por nome ou código do tipo do contrato',
		example: '001',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo de busca informado não é válido. Por favor, forneça um código ou nome válido.',
	})
	busca?: string;
}
