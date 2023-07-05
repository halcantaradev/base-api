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
		message: 'O campo email é obrigatório. Por favor, forneça um email.',
	})
	@IsEmail(
		{ ignore_max_length: true },
		{
			message:
				'O campo email informado não é válido. Por favor, forneça um email válido.',
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
		message: 'O campo nome é obrigatório. Por favor, forneça um nome.',
	})
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um nome válido',
	})
	nome: string;

	@ApiProperty({
		description: 'Username de acesso do usuário',
		example: 'usuario.exemplo',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo usuário de acesso é obrigatório. Por favor, forneça um usuário.',
	})
	@IsString({
		message:
			'O campo usuário de acesso informado não é válido. Por favor, forneça um nome de usuário válido.',
	})
	@Validate(UsernameNotExists)
	username: string;

	@ApiProperty({
		description: 'Senha de acesso do usuário',
		example: '123456',
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo senha é obrigatório. Por favor, forneça uma senha.',
	})
	@IsString({
		message:
			'O campo senha informado não é válido. Por favor, forneça uma senha válida.',
	})
	@Type(() => String)
	password: string;

	@ApiProperty({
		description: 'Cargo do usuário',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo cargo é obrigatório. Por favor, forneça um cargo.',
	})
	@IsInt({
		message:
			'O campo cargo informado não é válido. Por favor, forneça um cargo válido.',
	})
	@Type(() => Number)
	@Validate(CargoExists)
	cargo_id: number;

	@ApiProperty({
		description: 'Departamentos do usuário',
		example: [1, 2],
		required: false,
	})
	@IsInt({
		message:
			'O campo departamentos informado não é válido. Por favor, forneça um departamento válido.',
		each: true,
	})
	@IsNotEmpty({
		message:
			'O campo departamento é obrigatório. Por favor, forneça um departamento.',
	})
	departamentos: number[];
}
