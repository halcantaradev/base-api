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
		description: 'Identifica se o dia de domingo está marcado',
		example: true,
		required: false,
	})
	dom?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de segunda-feira está marcado',
		example: true,
		required: false,
	})
	seg?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de terça-feira está marcado',
		example: true,
		required: false,
	})
	ter?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de quarta-feira está marcado',
		example: true,
		required: false,
	})
	qua?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de quinta-feira está marcado',
		example: true,
		required: false,
	})
	qui?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de sexta-feira está marcado',
		example: true,
		required: false,
	})
	sex?: boolean;

	@ApiProperty({
		description: 'Identifica se o dia de sábado está marcado',
		example: true,
		required: false,
	})
	sab?: boolean;

	@ApiProperty({
		description: 'Identifica se a rota está ativa',
		example: true,
		required: false,
	})
	ativo?: boolean;
}
