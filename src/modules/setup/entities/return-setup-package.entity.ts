import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupPackage } from './setup-package.entity';

export class ReturnSetupPackageEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupPackage,
		readOnly: true,
		required: false,
	})
	data: SetupPackage;
}
