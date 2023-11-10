import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeExists } from 'src/shared/validators';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';

export class CreateNewDocumentVirtualPackageDto {
	@ApiProperty({
		description: 'Id do departamento',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O departamento informado não é válido. Por favor, forneça um departamento válido.',
	})
	@IsNotEmpty({
		message:
			'O campo departamento é obrigatório. Por favor, forneça um departamento.',
	})
	departamento_id: number;

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
			'O campo observação informado não é válido. Por favor, forneça um valor válido.',
	})
	@IsOptional()
	observacao?: string;
}
