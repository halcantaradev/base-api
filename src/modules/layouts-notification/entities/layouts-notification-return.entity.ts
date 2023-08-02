import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { LayoutsNotification } from './layouts-notification.entity';
import { LayoutConst } from 'src/shared/types';

export class LayoutsNotificationListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: LayoutsNotification,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: LayoutsNotification[];
}

export class LayoutsNotificationReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: LayoutsNotification,
		readOnly: true,
		required: false,
	})
	data: LayoutsNotification;
}

export class LayoutConstsReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: LayoutConst,
		readOnly: true,
		required: false,
		isArray: true,
	})
	data: LayoutConst;
}
