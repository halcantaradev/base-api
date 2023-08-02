import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from './department.entity';

export class DepartmentListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Department,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: Department[];
}
