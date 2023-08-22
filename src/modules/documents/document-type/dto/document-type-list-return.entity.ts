import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { DocumentType } from '../entities/document-type.entity';

export class DocumentTypeListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: DocumentType,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: DocumentType[];
}
