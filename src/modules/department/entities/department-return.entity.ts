import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from './department.entity';

export class DepartmentReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Department,
		readOnly: true,
		required: false,
	})
	data: Department;
}
