import { IsOptional, Validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { Transform } from 'class-transformer';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class UpdateUserDto extends CreateUserDto {
	@Validate(null)
	@IsOptional()
	email: string;

	@Validate(null)
	@IsOptional()
	whatsapp: string;

	@Validate(null)
	@IsOptional()
	username: string;

	@IsOptional()
	nome: string;

	@IsOptional()
	password: string;

	@IsOptional()
	cargo_id: number;

	@IsOptional()
	tipo_usuario: number;

	@ApiProperty({
		description: 'Status do usuário',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo: boolean;

	@IsOptional()
	departamentos: number[];
}
