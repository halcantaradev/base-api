import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LayoutsNotification } from '../entities/layouts-notification.entity';

export class CreateLayoutsNotificationDto extends PartialType(
	LayoutsNotification,
) {
	@ApiProperty({
		description: 'Nome do modelo',
		example: 'Infração de estacionamento',
		required: true,
	})
	@IsNotEmpty({ message: 'O nome é obrigatório' })
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um nome válido.',
	})
	nome: string;

	@ApiProperty({
		description: 'Conteúdo do modelo',
		example: '<h1>Titúlo da notificação</h1>...',
		required: true,
	})
	@IsNotEmpty({ message: 'O nome é obrigatório' })
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um nome válido.',
	})
	modelo: string;
}
