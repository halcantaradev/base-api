import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupPackageDriver } from './setup-package-driver.entity';

export class ReturnSetupPackageDriverListEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupPackageDriver,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: SetupPackageDriver[];
}
