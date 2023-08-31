import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class FiltersProtocolCondominiumDto {
	@ApiProperty({
		description: 'Filtro por nome ou código do condomínio',
		example: '001',
		required: false,
	})
	@IsOptional()
	busca: string;

	@ApiProperty({
		description: 'Departamento do condomínio',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo departamento de origem informado não é válido. Por favor, forneça um departamento válido.',
	})
	@IsNotEmpty({
		message:
			'O campo departamento de origem é obrigatório. Por favor, forneça um departamento.',
	})
	@Type(() => Number)
	departamento_id: number;
}
