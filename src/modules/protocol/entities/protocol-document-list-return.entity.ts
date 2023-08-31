import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProtocolDocument } from './protocol-document.entity';

export class ProtocolDocumentListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ProtocolDocument,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: ProtocolDocument[];
}
