import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class ReturnUserListEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: UserEntity,
		readOnly: true,
		required: false,
		isArray: true,
	})
	data: UserEntity[];
}
