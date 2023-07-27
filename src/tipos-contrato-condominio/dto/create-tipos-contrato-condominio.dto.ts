import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class CreateTiposContratoCondominioDto {
	@ApiProperty({
		description: 'Nome do contrato',
		example: 'Premium',
		required: true,
	})
	@IsNotEmpty()
	nome: string;

	@ApiProperty({
		description: 'Status de atividade do contrato',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo ativo informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsNotEmpty()
	ativo: boolean;
}
