import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestFirstAccessDto {
	@ApiProperty({
		description: 'Usuário ou email de acesso do usuário',
		example: 'admin',
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo usuário é obrigatório. Por favor, forneça um usuário ou email.',
	})
	@IsString({
		message:
			'O campo usuário informado não é válido. Por favor, forneça um usuário ou email válido.',
	})
	busca: string;
}
