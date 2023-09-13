import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SendEmailProtocolDto {
	@ApiProperty({
		description: 'Condomínio do protocolo',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	@IsNotEmpty({
		message:
			'O condomínio é obrigatório. Por favor, forneça um condomínio.',
	})
	@Type(() => Number)
	condominio_id: number;

	@ApiProperty({
		description: 'Contatos do condomínio do protocolo',
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
