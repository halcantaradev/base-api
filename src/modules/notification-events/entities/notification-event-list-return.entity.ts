import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationEvent } from './notification-event.entity';

export class NotificationEventListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: NotificationEvent,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: NotificationEvent[];
}
