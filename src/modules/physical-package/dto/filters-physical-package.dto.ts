import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class FiltersPhysicalPackage {
	@ApiProperty({
		description: 'Filtro por  código do malote físico',
		example: '000001',
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
	@Transform(BooleanTransformHelper)
	ativo?: boolean;

	@ApiProperty({
		description: 'Filtro por  situação do malote físico',
		example: true,
		required: false,
	})
	@IsOptional()
	@Transform(BooleanTransformHelper)
	disponivel?: boolean;
}
