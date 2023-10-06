import { PartialType } from '@nestjs/swagger';
import { CreateNewDocumentVirtualPackageDto } from './create-new-document-virtual-package.dto';

export class UpdateNewDocumentVirtualPackageDto extends PartialType(
	CreateNewDocumentVirtualPackageDto,
) {}
