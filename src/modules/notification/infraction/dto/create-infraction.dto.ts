import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class CreateInfractionDto {
	@ApiProperty({
		description: 'Descrição do tipo de notificação',
		example: 'INFRAÇÃO DE TESTE',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo descrição é obrigatório. Por favor, forneça o descrição.',
	})
	@IsString({
		message:
			'O campo descrição informado não é válido. Por favor, forneça uma descrição válida.',
	})
	descricao: string;

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
		description: 'Situação atual do tipo da notificação',
		example: true,
		required: false,
	})
	@IsNotEmpty({
		message: 'O campo status é obrigatório. Por favor, forneça um status.',
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	ativo: boolean;
}
