import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupPackageRoute } from './setup-package-route.entity';

export class ReturnSetupPackageRouteListEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupPackageRoute,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: SetupPackageRoute[];
}
