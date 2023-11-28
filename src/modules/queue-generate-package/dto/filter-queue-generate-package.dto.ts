import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class FilterQueueGeneratePackageDto {
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
