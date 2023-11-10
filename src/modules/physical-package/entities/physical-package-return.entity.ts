import { ReturnEntity } from 'src/shared/entities/return.entity';
import { PhysicalPackage } from './physical-package.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PhysicalPackageReturnEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: PhysicalPackage,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: PhysicalPackage;
}
