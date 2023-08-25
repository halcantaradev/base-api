import { PartialType } from '@nestjs/swagger';
import { CreateDocumentProtocolDto } from './create-document-protocol.dto';

export class UpdateDocumentProtocolDto extends PartialType(
	CreateDocumentProtocolDto,
) {}
