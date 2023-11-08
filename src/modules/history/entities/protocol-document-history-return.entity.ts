import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProtocolDocumentHistory } from './protocol-document-history.entity';

export class ProtocolDocumentHistoryReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ProtocolDocumentHistory,
		readOnly: true,
		required: false,
	})
	data: ProtocolDocumentHistory;
}
