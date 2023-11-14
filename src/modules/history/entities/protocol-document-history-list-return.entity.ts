import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProtocolDocumentHistory } from './protocol-document-history.entity';

export class ProtocolDocumentHistoryListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ProtocolDocumentHistory,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: ProtocolDocumentHistory[];
}
