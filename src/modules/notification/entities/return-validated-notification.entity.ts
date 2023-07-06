import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ValidatedNotification } from './validated-notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnValidatedNotificationEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ValidatedNotification,
		readOnly: true,
		required: false,
	})
	data: ValidatedNotification;
}
