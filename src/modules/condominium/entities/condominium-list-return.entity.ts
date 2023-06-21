import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from './condominium.entity';

export class CondominiumListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Condominium,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: Condominium[];
}
