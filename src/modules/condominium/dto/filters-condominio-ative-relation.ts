import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { FiltersResidenceActiveDto } from './filters-residence-active.dto';

export class FiltersCondominiumActiveRelationDto extends FiltersResidenceActiveDto {
	@IsOptional()
	condominios_ids?: number[];

	@ApiProperty({
		description: 'Id do usuário',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo departamentos informado não é válido. Por favor, forneça um departamento válido.',
		each: true,
	})
	@IsOptional()
	usuario_id?: number[];
}
