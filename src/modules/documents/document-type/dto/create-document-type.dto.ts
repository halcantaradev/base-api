import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class CreateDocumentTypeDto {
	@ApiProperty({
		description: 'Nome do tipo de documento',
		example: 'Boleto',
		required: true,
	})
	@IsNotEmpty({ message: 'O nome é obrigatório' })
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um nome válido.',
	})
	nome: string;

	@ApiProperty({
		description: 'Status do tipo de documento',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo ativo informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsNotEmpty({ message: 'O campo ativo é obrigatório' })
	ativo: boolean;
}
