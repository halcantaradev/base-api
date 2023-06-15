import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from './permission.entity';

export class PermissionReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Permission,
		readOnly: true,
		required: false,
	})
	data: Permission;
}
