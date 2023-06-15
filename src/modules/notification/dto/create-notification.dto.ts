import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsDate,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateNotificationDto {
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
	infracao_id: number;

	@ApiProperty({
		description: 'Data da emissão',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo data de emissão é obrigatório. Por favor, forneça uma data de emissão.',
	})
	@IsDate({
		message:
			'O campo data de emissão informado não é válido. Por favor, forneça uma data de emissão válida.',
	})
	@Type(() => Date)
	data_emissao: Date;

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

	@ApiProperty({
		description: 'Número da notificação',
		example: '01/2023',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo número da notificação é obrigatório. Por favor, forneça o número da notificação.',
	})
	@IsString({
		message:
			'O campo número da notificação informado não é válido. Por favor, forneça um nome de usuário válido.',
	})
	n_notificacao: string;

	@ApiProperty({
		description: 'Detalhamento da notificação',
		example: 'INFRAÇÃO DE TESTE',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo detalhe da notificação é obrigatório. Por favor, forneça o detalhe da notificação.',
	})
	@IsString({
		message:
			'O campo detalhe da notificação informado não é válido. Por favor, forneça um detalhamento da notificação válido.',
	})
	detalhes_infracao: string;

	@ApiProperty({
		description: 'Tipo de registro da notificação',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo tipo de registro é obrigatório. Por favor, forneça um tipo de registro.',
	})
	@IsInt({
		message:
			'O campo tipo de registro informado não é válido. Por favor, forneça um tipo de registro válido.',
	})
	tipo_registro: 1 | 2;

	@ApiProperty({
		description: 'Fundamentação legal infrigida na notificação',
		example: 'LEI DE TESTE DO ARTIGO TESTE N° TESTE',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo fundamentação legal é obrigatório. Por favor, forneça uma fundamentação legal.',
	})
	@IsString({
		message:
			'O campo fundamentação legal informado não é válido. Por favor, forneça uma fundamentação legal válida.',
	})
	fundamentacao_legal: string;

	@ApiProperty({
		description: 'Observação da notificação',
		example: 'Observação Teste',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo observação informado não é válido. Por favor, forneça uma observação válida.',
	})
	observacao: string;
}
