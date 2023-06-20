import {
	IsArray,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from 'class-validator';

export class FilterNotificationDto {
	@IsNotEmpty({
		message:
			'O campo condomínio é obrigatório. Por favor, selecione um condomínio válido.',
	})
	@IsArray({
		message:
			'O campo condomínio informado não é válido. Por favor, forneça uma unidade válida.',
	})
	condominios_ids: number[];

	@IsOptional()
	@IsArray({
		message:
			'O campo unidade informado não é válido. Por favor, forneça uma unidade válida.',
	})
	unidades_ids: number[];

	@IsOptional()
	condominos_ids: number[];

	@IsInt({
		message:
			'O campo condômino informado não é válido. Por favor, selecione uma unidade válida',
	})
	@IsOptional()
	tipo_notificacao: number;

	@IsOptional()
	consultor_id: number;

	@IsOptional()
	tipo_infracao_id: number;

	@IsOptional()
	tipo_data_filtro: number;

	@IsOptional()
	@IsDateString()
	data_inicial: Date;

	@IsOptional()
	@IsDateString()
	data_final: Date;
}
