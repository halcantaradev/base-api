import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FirstAccessDto {
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
	password: string;

	@ApiProperty({
		description: 'Confirmação da senha de acesso do usuário',
		example: '123456',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo confirmação de senha é obrigatório. Por favor, forneça uma valor.',
	})
	@IsString({
		message:
			'O campo confirmação de senha informado não é válido. Por favor, forneça uma senha válida.',
	})
	confirmPassword: string;
}
