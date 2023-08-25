import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { DocumentTypeExists, CondominiumExists } from 'src/shared/validators';

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
		description: 'Observação do documento',
		example: 'Observação Teste',
		required: true,
	})
	@IsString({
		message:
			'O campo discriminação informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsOptional()
	observacao?: string;

	@ApiProperty({
		description: 'Condomínio do documento',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo condomínio é obrigatório. Por favor, forneça um condomínio.',
	})
	@IsInt({
		message:
			'O campo condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	@Type(() => Number)
	@Validate(CondominiumExists)
	condominio_id: number;
}
