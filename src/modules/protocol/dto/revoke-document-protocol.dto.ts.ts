import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RevokeDocumentProtocolDto {
	@ApiProperty({
		description: 'Id(s) dos documento(s) do protocolo',
		example: [0, 1],
		required: true,
	})
	@IsInt({
		each: true,
		message: 'O campo documentos_ids deve ser um array de inteiros',
	})
	documentos_ids: number[];
}
