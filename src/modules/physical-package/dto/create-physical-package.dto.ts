import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsNotEmpty,
	IsString,
	IsBoolean,
	IsInt,
	IsDate,
} from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class CreatePhysicalPackageDto {
	@ApiProperty({
		example: '123456',
		description: 'O código do pacote físico',
	})
	@IsNotEmpty({ message: 'O campo código é obrigatório' })
	@IsString({ message: 'O campo código deve ser uma string' })
	codigo: string;

	@ApiProperty({
		example: true,
		description: 'Indica se o pacote físico está disponível',
	})
	@IsBoolean({ message: 'O campo disponível deve ser um valor booleano' })
	@Transform(BooleanTransformHelper)
	disponivel: boolean;

	@ApiProperty({ example: 1, description: 'A situação do pacote físico' })
	@IsInt({ message: 'O campo situação deve ser um número inteiro' })
	situacao: number;

	@ApiProperty({
		example: false,
		description: 'Indica se o pacote físico possui alerta',
	})
	@IsBoolean({ message: 'O campo alerta deve ser um valor booleano' })
	@Transform(BooleanTransformHelper)
	alerta: boolean;
}
