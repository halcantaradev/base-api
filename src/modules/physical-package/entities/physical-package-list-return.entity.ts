import { ApiProperty } from '@nestjs/swagger';
import { PhysicalPackage } from './physical-package.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class PhysicalPackageListReturnEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: PhysicalPackage,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: PhysicalPackage[];
}
