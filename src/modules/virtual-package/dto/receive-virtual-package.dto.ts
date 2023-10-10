import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ReceiveVirtualPackageDto {
	@ApiProperty({
		description: 'Id dos documentos',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'Os documentos informado não é válido. Por favor, forneça documentos válidos.',
	})
	@IsNotEmpty({
		message:
			'O campo de documentos é obrigatório. Por favor, forneça um documento.',
	})
	documentos_ids: number[];
}
