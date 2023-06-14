import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsString,
	Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UsernameNotExists, EmailNotExists, CargoExists } from '../validators';

export class CreateUserDto {
	@ApiProperty({
		description: 'Email de acesso do usuário',
		example: 'usuario@exemplo.com',
		required: true,
	})
	@IsNotEmpty({
		message: 'O parâmetro email é obrigatório',
	})
	@IsEmail(
		{ ignore_max_length: true },
		{
			message: 'O parâmetro email precisa ser um email válido',
		},
	)
	@Validate(EmailNotExists)
	email: string;

	@ApiProperty({
		description: 'Nome do usuário',
		example: 'Irineu Campos',
		required: true,
	})
	@IsNotEmpty({
		message: 'O parâmetro nome é obrigatório',
	})
	@IsString({
		message: 'O parâmetro nome precisa ser do tipo String',
	})
	nome: string;

	@ApiProperty({
		description: 'Username de acesso do usuário',
		example: 'usuario.exemplo',
		required: true,
	})
	@IsNotEmpty({
		message: 'O parâmetro username é obrigatório',
	})
	@IsString({
		message: 'O parâmetro username precisa ser do tipo String',
	})
	@Validate(UsernameNotExists)
	username: string;

	@ApiProperty({
		description: 'Senha de acesso do usuário',
		example: '123456',
		required: true,
	})
	@IsNotEmpty({
		message: 'O parâmetro password é obrigatório',
	})
	@IsString({
		message: 'O parâmetro password precisa ser do tipo String',
	})
	password: string;

	@ApiProperty({
		description: 'Cargo do usuário',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'O parâmetro cargo_id é obrigatório',
	})
	@IsInt({
		message: 'O parâmetro cargo_id precisa ser do tipo Int',
	})
	@Type(() => Number)
	@Validate(CargoExists)
	cargo_id: number;
}
