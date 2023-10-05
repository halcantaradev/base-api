import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class PhysicalPackageVirtualPackageListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: PhysicalPackageVirtualPackageListReturn,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: PhysicalPackageVirtualPackageListReturn[];
}
