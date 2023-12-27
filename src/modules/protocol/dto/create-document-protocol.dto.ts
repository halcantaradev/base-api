import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import {
	CondominiumOrCompanyExists,
	DocumentTypeExists,
} from 'src/shared/validators';

export class CreateDocumentProtocolDto {
	@ApiProperty({
		description: 'Tipo do documento',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo tipo é obrigatório. Por favor, forneça um tipo.',
	})
	@IsInt({
		message:
			'O campo tipo informado não é válido. Por favor, forneça um tipo válido.',
	})
	@Type(() => Number)
	@Validate(DocumentTypeExists)
	tipo_documento_id: number;

	@ApiProperty({
		description: 'Discriminação do documento',
		example: 'Discriminação Teste',
		required: true,
	})
	@IsString({
		message:
			'O campo discriminação informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsNotEmpty({
		message:
			'O campo discriminação é obrigatório. Por favor, forneça um discriminação.',
	})
	discriminacao: string;

	@ApiProperty({
		description: 'Retorno do documento',
		example: true,
		required: true,
	})
	@IsOptional()
	@Transform(BooleanTransformHelper)
	retorna: boolean;

	@ApiProperty({
		description: 'Data de vencimento do protocolo',
		example: new Date(),
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{
			message:
				'O campo data de vencimento deve ser uma data. Por favor, forneça uma data.',
		},
	)
	vencimento?: string;

	@ApiProperty({
		description: 'Valor do documento',
		example: 12.34,
		required: true,
	})
	@IsOptional()
	@IsNumber(
		{},
		{
			message:
				'O campo valor informado não é válido. Por favor, forneça um valor.',
		},
	)
	valor?: number;

	@ApiProperty({
		description: 'Observação do documento',
		example: 'Observação Teste',
		required: true,
	})
	@IsString({
		message:
			'O campo observação informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsOptional()
	observacao?: string;

	@ApiProperty({
		description: 'Condomínio/empresa do documento',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo condomínio/empresa é obrigatório. Por favor, forneça um valor.',
	})
	@IsInt({
		message:
			'O campo condomínio/empresa informado não é válido. Por favor, forneça um valor válido.',
	})
	@Type(() => Number)
	@Validate(CondominiumOrCompanyExists)
	pessoa_id: number;
}
