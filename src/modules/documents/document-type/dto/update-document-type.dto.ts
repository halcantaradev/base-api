import { PartialType } from '@nestjs/swagger';
import { CreateDocumentTypeDto } from './create-document-type.dto';
import { IsOptional } from 'class-validator';

export class UpdateDocumentTypeDto extends PartialType(CreateDocumentTypeDto) {
	@IsOptional()
	nome?: string;

	@IsOptional()
	ativo?: boolean;
}
