import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class SetupVirtualPackageListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupVirtualPackageListReturn,
		readOnly: true,
		required: false,
	})
	data: SetupVirtualPackageListReturn;
}
