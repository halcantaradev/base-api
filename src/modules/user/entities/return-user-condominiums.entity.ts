import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserCondominiums } from './user-condominiums.entity';

export class ReturnUserCondominiums extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: UserCondominiums,
		readOnly: true,
		required: true,
	})
	data: UserCondominiums;
}
