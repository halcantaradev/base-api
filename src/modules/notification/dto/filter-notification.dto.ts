import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from 'class-validator';

export class FilterNotificationDto {
	@ApiProperty({
		description: 'Id(s) do(s) condomínio(s)',
		isArray: true,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo condomínio é obrigatório. Por favor, selecione um condomínio válido.',
	})
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
	unidades_ids: number;

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
	@IsInt({
		message:
			'O campo condômino informado não é válido. Por favor, selecione uma unidade válida',
	})
	@IsOptional()
	tipo_notificacao: number;

	@ApiProperty({
		description: 'Id do consultor',
		example: 1,
	})
	@IsOptional()
	consultor_id: number;

	@ApiProperty({
		description: 'Id do tipo de infração',
		example: 1,
	})
	@IsOptional()
	tipo_infracao_id: number;

	@ApiProperty({
		description:
			'Tipo de filtragem entre períodos, sendo 1 para data de emissão e 2 para data da infração',
	})
	@IsOptional()
	tipo_data_filtro: number;

	@ApiProperty({
		description: 'Data inicial do período',
		example: '2023-06-20T00:00:00',
	})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	data_inicial: Date;

	@ApiProperty({
		description: 'Data final do período',
		example: '2023-06-21T00:00:00',
	})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	data_final: Date;
}
