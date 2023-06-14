import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsOptional,
	IsString,
	Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { CargoExists, EmailNotExists } from '../validators';

export class UpdateUserDto {
	@ApiProperty({
		description: 'Email de acesso do usuário',
		example: 'usuario@exemplo.com',
		required: false,
	})
	@IsEmail(
		{ ignore_max_length: true },
		{
			message: 'O parâmetro email precisa ser um email válido',
		},
	)
	@IsOptional()
	@Validate(EmailNotExists)
	email: string;

	@ApiProperty({
		description: 'Nome do usuário',
		example: 'Usuario Teste',
		required: false,
	})
	@IsString({
		message: 'O parâmetro nome precisa ser do tipo String',
	})
	@IsOptional()
	nome: string;

	@ApiProperty({
		description: 'Senha de acesso do usuário',
		example: '123456',
		required: false,
	})
	@IsString({
		message: 'O parâmetro password precisa ser do tipo String',
	})
	@IsOptional()
	password: string;

	@ApiProperty({
		description: 'Cargo do usuário',
		example: 1,
		required: false,
	})
	@IsInt({
		message: 'O parâmetro cargo_id precisa ser do tipo Int',
	})
	@Type(() => Number)
	@Validate(CargoExists)
	@IsOptional()
	cargo_id: number;

	@ApiProperty({
		description: 'Situação atual do usuário',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType)
	@Transform(({ value }) => {
		return ['true', '1'].includes(value);
	})
	@IsOptional()
	ativo: boolean;
}
