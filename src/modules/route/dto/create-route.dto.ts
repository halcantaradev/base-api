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
		description: 'Dias da rota',
		example: [1, 2],
		required: false,
		isArray: true,
	})
	@IsInt({
		each: true,
		message:
			'O campo de dias informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsNotEmpty({
		message:
			'O campo de dias é obrigatório. Por favor, selecione algum dia.',
	})
	@Max(7, {
		each: true,
		message:
			'O campo de dias informado não é válido. Por favor, forneça um valor válido.',
	})
	@Min(1, {
		each: true,
		message:
			'O campo de dias informado não é válido. Por favor, forneça um valor válido.',
	})
	dias: number[];

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
