import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterUserCondominiumDto {
	@ApiProperty({
		description: 'Filtro por departamento do usuário',
		example: 1,
		required: false,
	})
	@IsNotEmpty({
		message:
			'O campo departamento é obrigatório. Por favor, forneça um departamento.',
	})
	@IsInt({
		message:
			'O campo departamento informado não é válido. Por favor, forneça um departamento válido.',
	})
	@Type(() => Number)
	departamento_id?: number;
}
