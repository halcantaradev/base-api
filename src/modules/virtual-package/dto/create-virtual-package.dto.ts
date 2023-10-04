import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

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
		description: 'Dia da semana para saida do malote fisíco',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O dia informado não é válido. Por favor, forneça um dia válido.',
	})
	@Max(7, {
		message:
			'O dia informado não é válido. Por favor, forneça um dia válido.',
	})
	@Min(1, {
		message:
			'O dia informado não é válido. Por favor, forneça um dia válido.',
	})
	@IsNotEmpty({
		message: 'O campo dia é obrigatório. Por favor, forneça um dia.',
	})
	dia: number;
}
