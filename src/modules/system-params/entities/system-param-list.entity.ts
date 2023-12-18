import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { SystemParam } from './system-param.entity';

export class SystemParamList extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SystemParam,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: SystemParam[];
}
