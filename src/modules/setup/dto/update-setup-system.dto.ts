import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSetupSystemDto {
	@ApiProperty({
		description: 'Salário minimo base para cálculos no sistema',
		example: 1506.65,
		required: true,
	})
	@IsNumber(
		{},
		{
			message:
				'O campo prazo para interpor recurso informado não é válido. Por favor, forneça um prazo válido.',
		},
	)
	@Type(() => Number)
	@IsOptional()
	salario_minimo_base?: number;
}
