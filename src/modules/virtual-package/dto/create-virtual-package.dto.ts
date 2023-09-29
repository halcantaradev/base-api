import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVirtualPackageDto {
	@ApiProperty({
		description: 'Id do condomínio',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	@IsNotEmpty({
		message:
			'O campo condomínio é obrigatório. Por favor, forneça um condomínio.',
	})
	condominio_id: number;

	@ApiProperty({
		description: 'Id do malote fisíco',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O malote informado não é válido. Por favor, forneça um malote válido.',
	})
	@IsOptional()
	malote_fisico_id?: number;

	@ApiProperty({
		description: 'Ids dos documentos',
		example: [1, 2],
		required: true,
		isArray: true,
	})
	@IsNotEmpty({
		message:
			'OS documentos são obrigatórios. Por favor, forneça os documentos.',
	})
	documentos_ids?: number[];
}
