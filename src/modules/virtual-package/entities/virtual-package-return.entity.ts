import { ReturnEntity } from 'src/shared/entities/return.entity';
import { VirtualPackage } from './virtual-package.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VirtualPackageListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: VirtualPackage,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: VirtualPackage[];
}
