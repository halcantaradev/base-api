import { ApiProperty } from '@nestjs/swagger';

export class SetupSystem {
	@ApiProperty({
		description: 'Salário minimo base para cálculos no sistema',
		example: 1506.65,
		required: true,
	})
	salario_minimo_base: number;
}
