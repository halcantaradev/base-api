import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FiltersPhysicalPackage {
	@ApiProperty({
		description: 'Filtro por  código do malote físico',
		example: '001',
		required: false,
	})
	@IsString({
		message:
			'O campo código informado não é válido. Por favor, forneça um código válido.',
	})
	@IsOptional()
	codigo?: string;

	@ApiProperty({
		description: 'Filtro por  código do malote físico',
		example: true,
		required: false,
	})
	@IsOptional()
	ativo?: boolean;

	@ApiProperty({
		description: 'Filtro por  situação do malote físico',
		example: true,
		required: false,
	})
	@IsOptional()
	disponivel?: boolean;
}
