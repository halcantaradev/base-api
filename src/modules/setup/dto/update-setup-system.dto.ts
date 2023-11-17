import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators';

export class UpdateSetupSystemDto {
	@ApiProperty({
		description: 'Salário minimo base para cálculos no sistema',
		example: 1506.65,
		required: true,
	})
	@IsNumber(
		{},
		{
			message:
				'O campo prazo para interpor recurso informado não é válido. Por favor, forneça um prazo válido.',
		},
	)
	@Type(() => Number)
	@IsOptional()
	salario_minimo_base?: number;

	@ApiProperty({
		description: 'Sanção aplicado no sistema',
		example: 'Texto teste',
		required: true,
	})
	@IsString({
		message:
			'O campo sanção informado não é válido. Por favor, forneça um sanção válido.',
	})
	@IsOptional()
	sancao?: string;

	@ApiProperty({
		description: 'Texto padrão aplicado nas notificações do sistema',
		example: 'Texto teste',
		required: true,
	})
	@IsString({
		message:
			'O campo texto padrão informado não é válido. Por favor, forneça um texto válido.',
	})
	@IsOptional()
	texto_padrao_notificacao?: string;

	@ApiProperty({
		description:
			'Texto padrão aplicado nas notificações de multa do sistema',
		example: 'Texto teste',
		required: true,
	})
	@IsString({
		message:
			'O campo texto padrão de multa informado não é válido. Por favor, forneça um texto válido.',
	})
	@IsOptional()
	texto_padrao_notificacao_multa?: string;

	@ApiProperty({
		description: 'Status de uso de malotes físicos',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo obriga malote físico é obrigatório. Por favor, forneça um valor.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	obriga_malote_fisico: boolean;
}
