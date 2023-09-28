import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Route } from './route.entity';

export class RouteReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Route,
		readOnly: true,
		required: false,
	})
	data: Route;
}
