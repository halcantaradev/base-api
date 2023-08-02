import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from './condominium.entity';

export class CondominiumReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Condominium,
		readOnly: true,
		required: false,
	})
	data: Condominium;
}
