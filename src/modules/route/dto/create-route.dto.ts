import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsNotEmpty,
	IsInt,
	Validate,
	IsOptional,
	Max,
	Min,
} from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators';

export class CreateRouteDto {
	@ApiProperty({
		description: 'Turno da rota',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo turno é obrigatório. Por favor, forneça um turno.',
	})
	@IsInt({
		message:
			'O campo turno informado não é válido. Por favor, forneça um turno válido.',
	})
	@Type(() => Number)
	@Max(3, {
		message:
			'O campo turno informado não é válido. Por favor, forneça um turno válido.',
	})
	@Min(1, {
		message:
			'O campo turno informado não é válido. Por favor, forneça um turno válido.',
	})
	turno: 1 | 2 | 3;

	@ApiProperty({
		description: 'Identifica se o dia de domingo está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de domingo informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	dom?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de segunda-feira está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de segunda-feira informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	seg?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de terça-feira está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de terça-feira informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ter?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de quarta-feira está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de quarta-feira informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	qua?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de quinta-feira está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de quinta-feira informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	qui?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de sexta-feira está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de sexta-feira informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	sex?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de sábado está marcado',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O valor para o dia de sábado informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	sab?: boolean;

	@ApiProperty({
		description: 'Identifica se a rota está ativa',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo ativo informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo?: boolean;
}
