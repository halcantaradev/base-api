import { ApiProperty } from '@nestjs/swagger';

export class Route {
	@ApiProperty({
		description: 'Id da rota',
		example: 1,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Turno da rota',
		example: 1,
		required: true,
	})
	turno: 1 | 2 | 3;

	@ApiProperty({
		description: 'Dias da rota',
		example: [1, 2],
		required: false,
		isArray: true,
	})
	dias: number[];

	@ApiProperty({
		description: 'Identifica se a rota está ativa',
		example: true,
		required: false,
	})
	ativo?: boolean;
}
