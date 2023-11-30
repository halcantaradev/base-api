import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordRecoveryDto {
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
	@MinLength(6, {
		message:
			'O campo senha deve ter pelo menos 6 caracteres. Por favor, forneça uma senha de pelo menos 6 caracteres.',
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
	@MinLength(6, {
		message:
			'O campo confirmação de senha deve ter pelo menos 6 caracteres. Por favor, forneça uma senha de pelo menos 6 caracteres.',
	})
	confirmPassword: string;
}
