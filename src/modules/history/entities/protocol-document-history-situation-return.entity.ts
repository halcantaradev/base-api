import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProtocolDocumentHistorySituation } from './protocol-document-history-situation.entity';

export class ProtocolDocumentHistorySituationReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ProtocolDocumentHistorySituation,
		readOnly: true,
		required: false,
	})
	data: ProtocolDocumentHistorySituation;
}
