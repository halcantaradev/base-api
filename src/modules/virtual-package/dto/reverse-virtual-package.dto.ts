import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ReverseVirtualPackageDto {
	@ApiProperty({
		description: 'Ids dos documentos',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'Os documentos informados não são válidos. Por favor, forneça documentos válidos.',
	})
	@IsNotEmpty({
		message:
			'O campo de documentos é obrigatório. Por favor, forneça um documento.',
	})
	documentos_ids: number[];
}
