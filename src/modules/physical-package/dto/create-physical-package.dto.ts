import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsInt } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class CreatePhysicalPackageDto {
	@ApiProperty({
		example: '123456',
		description: 'O código do malote físico',
		required: true,
	})
	@IsNotEmpty({ message: 'O campo código é obrigatório' })
	@IsString({ message: 'O campo código deve ser uma string' })
	codigo: string;

	@ApiProperty({
		example: false,
		description: 'Indica se o malote físico possui alerta',
		required: true,
	})
	@IsNotEmpty()
	@IsBoolean({ message: 'O campo alerta deve ser um valor booleano' })
	@Transform(BooleanTransformHelper)
	alerta: boolean;
}
