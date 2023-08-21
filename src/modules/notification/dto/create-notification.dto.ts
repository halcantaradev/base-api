import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsInt,
	IsNotEmpty,
	IsNumber,
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
		description: 'Id do morador, inquilino ou proprietário',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo pessoa é obrigatório. Por favor, forneça pessoa unidade.',
	})
	@IsInt({
		message:
			'O campo pessoa informado não é válido. Por favor, forneça uma pessoa válida.',
	})
	pessoa_id: number;

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
	observacoes?: string;

	@ApiProperty({
		description: 'Valor da multa',
		example: 1202.01,
		required: false,
	})
	@IsOptional()
	@Type(() => Number)
	@IsNumber({}, { message: 'O campo deve conter apenas números' })
	valor_multa?: number;

	@ApiProperty({
		description: 'Competência da multa',
		example: '2023/01',
		required: false,
	})
	@IsOptional()
	@IsString({
		message: 'O campo dever seguir o formato esperado.',
	})
	competencia_multa?: string;

	@ApiProperty({
		description: 'Unir a taxa de condomínio',
		example: true,
		required: false,
	})
	@IsOptional()
	@IsBoolean({
		message: 'O campo dever ser verdadeiro ou falso.',
	})
	unir_taxa?: boolean;

	@ApiProperty({
		description: 'Vencimento da multa',
		example: '2023-08-01T23:59:59.000Z',
		required: false,
	})
	@IsOptional()
	@IsString({
		message: 'O campo dever está no formato válido.',
	})
	vencimento_multa?: Date;

	@ApiProperty({
		description: 'Layout usado para impressão',
		example: 'Modelo teste',
		required: false,
	})
	@IsNotEmpty({
		message:
			'O modelo de impressão é obrigatório. Por favor, forneça o modelo de impressão.',
	})
	@IsInt({
		message:
			'O modelo de impressão não é válido. Por favor, forneça uma unidade válida.',
	})
	layout_id: number;

	@IsOptional()
	doc_gerado?: string;
}
