import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateQueueGeneratePackageDto {
	@ApiProperty({
		description: 'Ids dos documentos',
		example: [1, 2, 3],
		isArray: true,
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'O documento informado não é válido. Por favor, forneça um documento válido.',
	})
	@IsNotEmpty({
		message: 'O documento é obrigatório. Por favor, forneça um documento.',
	})
	documentos_ids: number[];
}
