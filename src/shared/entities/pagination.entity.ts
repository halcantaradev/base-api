import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Pagination {
	@ApiProperty({
		description: 'Página para filtrar a lista de dados',
		example: 2,
		readOnly: true,
	})
	@Type(() => Number)
	page?: number;
}
