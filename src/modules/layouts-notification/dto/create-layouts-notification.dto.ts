import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { LayoutsNotification } from '../entities/layouts-notification.entity';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { Transform } from 'class-transformer';

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

	@ApiProperty({
		description: 'Status do modelo',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo?: boolean;
}
