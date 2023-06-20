import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FileUploadDto {
	@ApiProperty({
		description: 'Origem do arquivo',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo origem informado não é válido. Por favor, forneça uma origem.',
	})
	@IsInt({
		message:
			'O campo origem informado não é válido. Por favor, forneça uma origem válida.',
	})
	@Type(() => Number)
	origin: number;

	@ApiProperty({
		description: 'Origem do arquivo',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo id de referência é obrigatório. Por favor, forneça um id de referência.',
	})
	@IsInt({
		message:
			'O campo id de referência informado não é válido. Por favor, forneça um id de referência válido.',
	})
	@Type(() => Number)
	reference_id: number;

	@ApiProperty({
		description: 'Arquivos que serão salvos',
		type: 'string',
		format: 'binary',
		isArray: true,
		required: true,
	})
	files: Express.Multer.File[];
}
