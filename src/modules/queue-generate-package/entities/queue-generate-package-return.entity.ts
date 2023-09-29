import { ApiProperty } from '@nestjs/swagger';
import { ProtocolDocumentListReturn } from 'src/modules/protocol/entities/protocol-document-list-return.entity';

export class QueueGeneratePackageReturn {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ProtocolDocumentListReturn,
		readOnly: true,
		required: false,
	})
	data: ProtocolDocumentListReturn[];
}
