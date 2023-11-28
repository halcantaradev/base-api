import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SendMailNotificationDto {
	@ApiProperty({
		description: 'Ids dos contatos selecionados notificação',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'O campo contatos informado não é válido. Por favor, selecione um contato.',
	})
	@IsOptional()
	contatos_ids?: number[];

	@ApiProperty({
		description: 'Lista de endereços de email adicionais',
		example: ['teste@exemplo.com', 'teste2@exemplo.com'],
		required: true,
	})
	@IsString({
		each: true,
		message:
			'O campo detalhe da notificação informado não é válido. Por favor, forneça um detalhamento da notificação válido.',
	})
	@IsOptional()
	emails?: string[];
}
