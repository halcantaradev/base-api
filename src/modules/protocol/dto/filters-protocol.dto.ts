import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanType } from 'src/shared/validators';
import { IsDateString, IsInt, IsOptional, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class FiltersProtocolDto {
	@ApiProperty({
		description: 'Filtro por numero do protocolo',
		example: '001',
		required: false,
	})
	@IsOptional()
	id: number | undefined;

	@ApiProperty({
		description: 'Filtro por tipo do protocolo',
		example: 1,
		required: false,
	})
	@IsOptional()
	tipo: 1 | 2;

	@ApiProperty({
		description: 'Filtro por tipo dos itens do protocolo',
		example: 1,
		required: false,
	})
	@IsOptional()
	tipo_protocolo: 1 | 2;

	@ApiProperty({
		description: 'Filtro por situação do protocolo',
		example: '001',
		required: false,
	})
	@IsOptional()
	situacao: 1 | 2 | 3;

	@ApiProperty({
		description: 'Filtro por usuário de origem',
		example: 1,
		required: false,
	})
	@IsOptional()
	origem_usuario_id: number;

	@ApiProperty({
		description: 'Filtro por numero do protocolo',
		example: '001',
		required: false,
	})
	@IsInt({
		each: true,
		message: 'O campo departamento origem deve ser um array',
	})
	@IsOptional()
	origem_departament_ids: number[];

	@ApiProperty({
		description: 'Filtro por usuário destino',
		example: 1,
		required: false,
	})
	@IsOptional()
	destino_usuario_id: number;

	@ApiProperty({
		description: 'Filtro por usuário que aceitou o protocolo',
		example: 1,
		required: false,
	})
	@IsOptional()
	aceito_por: number;

	@ApiProperty({
		description: 'Filtro por departamento destino',
		example: [1, 2],
		required: false,
	})
	@IsInt({
		each: true,
		message: 'O campo departamento destino deve ser um array',
	})
	@IsOptional()
	destino_departamento_ids: number[];

	@ApiProperty({
		description: 'Filtro por codomínio(s)',
		example: [1, 2],
		required: false,
	})
	@IsInt({
		each: true,
		message: 'O campo condomínio deve ser um  array',
	})
	@IsOptional()
	condominios_ids: number[];

	@ApiProperty({
		description: 'Filtro por data de emissão',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{ each: true, message: 'O campo data de emissão deve ser uma data' },
	)
	data_emissao: string[];

	@ApiProperty({
		description: 'Filtro por data que aceitou o protocolo',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{ each: true, message: 'O campo data aceito deve ser uma data' },
	)
	data_aceito: string[];

	@ApiProperty({
		description: 'Status de finalizado do protocolo',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	finalizado?: boolean;

	@ApiProperty({
		description: 'Status do protocolo',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo?: boolean;
}
