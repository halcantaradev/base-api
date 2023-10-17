import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestFirstAccessDto {
	@ApiProperty({
		description: 'Username de acesso do usuário',
		example: 'admin',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo usuário é obrigatório. Por favor, forneça um usuário.',
	})
	@IsString({
		message:
			'O campo usuário informado não é válido. Por favor, forneça um usuário válido.',
	})
	username: string;
}
