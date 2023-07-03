import { IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class FiltersResidenceDto {
	@ApiProperty({
		description: 'Filtro por nome ou código da unidade',
		example: '001',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo de busca informado não é válido. Por favor, forneça um código ou nome de unidade válido.',
	})
	busca?: string;

	@ApiProperty({
		description: 'Status da unidade',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(({ value }) => {
		if (value === null) return null;

		return ['true', '1', true, 1].includes(value);
	})
	@IsOptional()
	ativo?: boolean;
}
