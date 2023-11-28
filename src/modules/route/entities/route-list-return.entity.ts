import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Route } from './route.entity';

export class RouteListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Route,
		readOnly: true,
		required: false,
		isArray: true,
	})
	data: Route[];

	@ApiProperty({
		description: 'Total de registros',
		example: 1,
		readOnly: true,
	})
	total: number;
}
