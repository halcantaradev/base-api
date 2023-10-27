import { CreateNewDocumentVirtualPackageDto } from './create-new-document-virtual-package.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProtocolVirtualPackageDto {
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
		description: 'Documentos adicionados na baixa de malote',
		type: CreateNewDocumentVirtualPackageDto,
		isArray: true,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo documentos é obrigatório. Por favor, forneça um documento.',
	})
	documentos: CreateNewDocumentVirtualPackageDto[];
}
