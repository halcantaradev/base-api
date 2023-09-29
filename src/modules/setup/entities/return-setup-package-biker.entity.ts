import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupPackageBiker } from './setup-package-biker.entity';

export class ReturnSetupPackageBikerListEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupPackageBiker,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: SetupPackageBiker[];
}
