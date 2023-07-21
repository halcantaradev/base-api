import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class RemoveFileDto {
	@ApiProperty({
		description: 'Origem do arquivo',
		example: 1,
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'O campo origem informado não é válido. Por favor, forneça uma origem válida.',
	})
	ids: number[];
}
