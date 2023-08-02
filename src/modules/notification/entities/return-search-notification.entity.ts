import { ReturnEntity } from 'src/shared/entities/return.entity';
import { NotificationEntity } from './notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnSearchNotificationEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: NotificationEntity,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: NotificationEntity[];
}
