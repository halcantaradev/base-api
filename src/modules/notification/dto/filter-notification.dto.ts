import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

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
		description: 'Prazo para interpor recurso da notificação',
		example: 1,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo prazo de recurso não é válido. Por favor, selecione um valor válido',
	})
	prazo_recurso: number;

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
		description: 'Ids das filial',
		example: 1,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message: 'Por favor forneça uma filial válida',
	})
	filiais_ids: number[];

	@ApiProperty({
		description: 'Filtro por data da infração da notificação',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{ each: true, message: 'O campo data da infração deve ser uma data' },
	)
	data_infracao: string[];

	@ApiProperty({
		description: 'Filtro por data de emissão da notificação',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{ each: true, message: 'O campo data de emissão deve ser uma data' },
	)
	data_emissao: string[];
}
