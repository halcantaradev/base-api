import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class UpdateSetupNotificationDto {
	@ApiProperty({
		description: 'Regra aplicada para 1ª reincidência',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo primeira reincidencia informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	primeira_reincidencia?: boolean;

	@ApiProperty({
		description: 'Taxa base aplicada na 1ª reincidência',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O campo base de pagamento de primeira reincidencia informado não é válido. Por favor, forneça uma base de pagamento válida.',
	})
	@Type(() => Number)
	@IsOptional()
	primeira_reincidencia_base_pagamento?: number;

	@ApiProperty({
		description: 'Percentual sobre a taxa base aplicada na 1ª reincidência',
		example: 50,
		required: true,
	})
	@IsNumber(
		{},
		{
			message:
				'O campo percentual de pagamento informado não é válido. Por favor, forneça uma percentual de pagamento válida.',
		},
	)
	@Type(() => Number)
	@IsOptional()
	primeira_reincidencia_percentual_pagamento?: number;

	@ApiProperty({
		description: 'Regra aplicada para 2ª reincidência',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo segunda reincidencia informado não é válido. Por favor, forneça um segunda reincidencia válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	segunda_reincidencia?: boolean;

	@ApiProperty({
		description: 'Taxa base aplicada na 2ª reincidência',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O campo base de pagamento de segunda reincidencia informado não é válido. Por favor, forneça uma base de pagamento válida.',
	})
	@Type(() => Number)
	@IsOptional()
	segunda_reincidencia_base_pagamento?: number;

	@ApiProperty({
		description: 'Dias para uma unidade recorrer sobre notificação',
		example: 15,
		required: true,
	})
	@IsInt({
		message:
			'O campo prazo para interpor recurso informado não é válido. Por favor, forneça um prazo válido.',
	})
	@Type(() => Number)
	@IsOptional()
	prazo_interpor_recurso?: number;

	@ApiProperty({
		description: 'Obsevações padrões aplicadas em todas as notificações',
		example: 'Observação de teste',
		required: true,
	})
	@IsString({
		message:
			'O campo observação informado não é válido. Por favor, forneça um observação válido.',
	})
	@IsOptional()
	observacoes?: string;
}
