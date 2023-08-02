import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterInfractionActiveDto {
	@ApiProperty({
		description: 'Campo para filtragem por descrição',
		example: 'usuario@exemplo.com',
		required: false,
	})
	@IsString({
		message:
			'O campo busca informado não é válido. Por favor, forneça uma busca válida',
	})
	@IsOptional()
	busca?: string;
}
