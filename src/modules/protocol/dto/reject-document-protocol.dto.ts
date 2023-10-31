import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RejectDocumentProtocolDto {
	@ApiProperty({
		description: 'Ids de documentos do protocolo',
		example: true,
		required: false,
	})
	@IsInt({
		each: true,
		message: 'Os campos documentos_ids devem ser inteiros',
	})
	@IsNotEmpty({
		message: 'O campo documentos_ids devem ser preenchidos',
	})
	documentos_ids?: number[];

	@ApiProperty({
		description: 'Motivo do rejeição',
		example: 'Motivo do rejeição',
		required: false,
	})
	@IsString({
		message: 'Motivo do rejeição invalido, por favor forneca um valor',
	})
	@MinLength(10, {
		message: 'Motivo do rejeição deve ter pelo menos 10 caracteres',
	})
	@IsNotEmpty({
		message: 'Motivo do rejeição não pode ser vazio',
	})
	motivo_rejeitado: string;
}
