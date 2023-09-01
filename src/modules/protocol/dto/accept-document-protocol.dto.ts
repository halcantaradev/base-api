import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class AcceptDocumentProtocolDto {
	@ApiProperty({
		description: 'Ids de documentos do protocolo',
		example: true,
		required: false,
	})
	@IsInt({
		each: true,
		message: 'Os campos documentos_ids devem ser inteiros',
	})
	@IsOptional()
	documentos_ids?: number[];
}
