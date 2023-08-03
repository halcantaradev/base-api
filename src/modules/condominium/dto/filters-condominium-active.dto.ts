import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class FiltersCondominiumActiveDto {
	@ApiProperty({
		description: 'Departamentos do condomínio',
		example: [1, 2],
		required: false,
	})
	@IsInt({
		message:
			'O campo departamentos informado não é válido. Por favor, forneça um departamento válido.',
		each: true,
	})
	@IsOptional()
	departamentos_ids?: number[];
}
