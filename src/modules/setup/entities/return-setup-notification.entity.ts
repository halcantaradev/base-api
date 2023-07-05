import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupNotification } from './setup-notification.entity';

export class ReturnSetupNotificationEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupNotification,
		readOnly: true,
		required: false,
	})
	data: SetupNotification;
}
