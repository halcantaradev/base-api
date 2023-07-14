import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ValidateNotificationDto {
	@ApiProperty({
		description: 'Id da unidade',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo unidade é obrigatório. Por favor, forneça uma unidade.',
	})
	@IsInt({
		message:
			'O campo unidade informado não é válido. Por favor, forneça uma unidade válida.',
	})
	unidade_id: number;

	@ApiProperty({
		description: 'Id do tipo da infração',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo infração é obrigatório. Por favor, forneça uma infração.',
	})
	@IsInt({
		message:
			'O campo infração informado não é válido. Por favor, forneça uma infração válida.',
	})
	tipo_infracao_id: number;

	@ApiProperty({
		description: 'Id to tipo de notificação',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo tipo de notificação é obrigatório. Por favor, forneça uma data de infração.',
	})
	@IsInt({
		message:
			'O campo tipo de notificação informado não é válido. Por favor, forneça um tipo de notificação válida.',
	})
	tipo_registro: number;

	@ApiProperty({
		description: 'Data da infração',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo data de infração é obrigatório. Por favor, forneça uma data de infração.',
	})
	@IsDate({
		message:
			'O campo data de infração informado não é válido. Por favor, forneça uma data de infração válida.',
	})
	@Type(() => Date)
	data_infracao: Date;
}
