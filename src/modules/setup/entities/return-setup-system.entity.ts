import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupSystem } from './setup-system.entity';

export class ReturnSetupSystemEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupSystem,
		readOnly: true,
		required: false,
	})
	data: SetupSystem;
}
