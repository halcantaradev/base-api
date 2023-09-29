import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateQueueGeneratePackageDto {
	@ApiProperty({
		description: ' ID`s dos documentos',
		example: [1, 2, 3],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'O campo documentos_ids informado não é válido. Por favor, forneça a id do documento.',
	})
	@IsNotEmpty({
		message:
			'O campo documentos_ids é obrigatório. Por favor, forneça a id do documento.',
	})
	documentos_ids: number[];
}
