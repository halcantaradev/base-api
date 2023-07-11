import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class FilterNotificationDto {
	@ApiProperty({
		description: 'Id(s) do(s) condomínio(s)',
		isArray: true,
		required: true,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message:
			'O campo condomínio informado não é válido. Por favor, forneça ao menos um condomínio válido.',
	})
	condominios_ids: number[];

	@ApiProperty({
		description: 'Id(s) da(s) unidades(s)',
		isArray: true,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message:
			'O campo unidade informado não é válido. Por favor, forneça uma unidade válida.',
	})
	unidades_ids: number[];

	@ApiProperty({
		description: 'Id(s) dos condôminos(s)',
		isArray: true,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message: 'O campo dos condominos_ids precisa ser do tipo inteiro',
	})
	condominos_ids: number[];

	@ApiProperty({
		description: 'Tipo da notificação',
		example: 1,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo tipo de notificação não é válido. Por favor, selecione um tipo válido',
	})
	tipo_registro: number;

	@ApiProperty({
		description: 'Id dos consultores',
		example: 1,
	})
	@IsOptional()
	@IsInt({
		message: 'Por favor forneça um consultor válido',
		each: true,
	})
	consultores_ids: number[];

	@ApiProperty({
		description: 'Id do tipo de infração',
		example: 1,
	})
	@IsOptional()
	@IsInt({
		message: 'Por favor forneça um tipo de infração válida',
	})
	tipo_infracao_id: number;

	@ApiProperty({
		description:
			'Tipo de filtragem entre períodos, sendo 1 para data de emissão e 2 para data da infração',
	})
	@IsOptional()
	@IsInt({
		message: 'Por favor forneça um tipo de filtro de data válido',
	})
	tipo_data_filtro: number;

	@ApiProperty({
		description: 'Data inicial do período',
		example: '2023-06-20T00:00:00',
	})
	@IsOptional()
	@IsDate({
		message: 'Por favor forneça uma data válido',
	})
	@Type(() => Date)
	data_inicial: Date;

	@ApiProperty({
		description: 'Data final do período',
		example: '2023-06-21T00:00:00',
	})
	@IsOptional()
	@IsDate({
		message: 'Por favor forneça uma data válido',
	})
	@Type(() => Date)
	data_final: Date;
}
