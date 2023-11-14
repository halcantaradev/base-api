import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsDateString } from 'class-validator';

export class FiltersProtocolDocumentHistoryDto {
	@ApiProperty({
		description: 'Filtro por usuário dos registros',
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
		description: 'Filtro por situacao dos registros',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo situacao informado não é válido. Por favor, forneça uma situação válida.',
	})
	@Type(() => Number)
	@IsOptional()
	situacao?: number;

	@ApiProperty({
		description:
			'Período de datas (inicial e final) para filtro dos registros',
		example: [new Date(), new Date()],
		required: true,
	})
	@IsOptional()
	@IsDateString(
		{},
		{
			each: true,
			message:
				'O período informado não é válido. Por favor, forneça uma data válida.',
		},
	)
	data_registro: string[];
}
