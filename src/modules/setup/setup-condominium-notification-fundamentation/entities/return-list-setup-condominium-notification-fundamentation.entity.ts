import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupCondominiumNotificationFundamentation } from './setup-condominium-notification-fundamentation.entity';

export class ReturnListSetupCondominiumNotificationFundamentation extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupCondominiumNotificationFundamentation,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: SetupCondominiumNotificationFundamentation[];
}
