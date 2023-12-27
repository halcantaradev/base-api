import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SendEmailProtocolDto {
	@ApiProperty({
		description: 'Condominio/Empresa do protocolo',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O condomínio/empresa informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsNotEmpty({
		message:
			'O condomínio/empresa é obrigatório. Por favor, forneça um valor.',
	})
	@Type(() => Number)
	pessoa_id: number;

	@ApiProperty({
		description: 'Contatos da pessoa do protocolo',
		example: [1],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'O contato informado não é válido. Por favor, forneça um contato válido.',
	})
	@IsNotEmpty({
		message: 'O contato é obrigatório. Por favor, forneça um contato.',
	})
	@Type(() => Number)
	contatos_ids: number[];
}
