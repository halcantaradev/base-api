import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class FiltersProtocolCondominiumDto {
	@ApiProperty({
		description: 'Filtro por nome ou código do condomínio/empresa',
		example: '001',
		required: false,
	})
	@IsOptional()
	busca: string;

	@ApiProperty({
		description: 'Departamento de origem do protocolo',
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
	departamento_origem_id: number;

	@ApiProperty({
		description: 'Departamento de destino do protocolo',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo departamento de destino informado não é válido. Por favor, forneça um departamento válido.',
	})
	@IsNotEmpty({
		message:
			'O campo departamento de destino é obrigatório. Por favor, forneça um departamento.',
	})
	@Type(() => Number)
	departamento_destino_id: number;

	@ApiProperty({
		description: 'Tipo do protocolo',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo tipo é obrigatório. Por favor, forneça um tipo.',
	})
	@IsInt({
		message:
			'O campo tipo informado não é válido. Por favor, forneça um tipo válido.',
	})
	@Type(() => Number)
	tipo: 1 | 2;
}
