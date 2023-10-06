import { ReturnEntity } from 'src/shared/entities/return.entity';
import { NewDocumentVirtualPackage } from './new-document-virtual-package.entity';
import { ApiProperty } from '@nestjs/swagger';

export class NewDocumentVirtualPackageListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: NewDocumentVirtualPackage,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: NewDocumentVirtualPackage[];
}
