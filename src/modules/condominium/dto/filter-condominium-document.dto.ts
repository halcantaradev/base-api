import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class FilterCondominiumDocumentDto {
	@ApiProperty({
		description: 'Filtro por nome, código ou descrição do arquivo',
		example: '001',
		required: false,
	})
	@IsString({
		message:
			'O campo busca informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsOptional()
	busca?: string;

	@ApiProperty({
		description: 'Filtro por data de envio do documento',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{
			each: true,
			message: 'O campo data de envio deve ser uma data válida',
		},
	)
	data_envio: string[];
}
