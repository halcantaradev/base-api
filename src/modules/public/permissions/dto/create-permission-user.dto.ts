import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionUserDto {
	@ApiProperty({
		description: 'Id do usuário para conceder permissão',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'Informe o usuário',
	})
	usuario_id: number;

	empresa_id: number;

	@ApiProperty({
		description: 'Id da permissão a ser condecida',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'Informe a permissão',
	})
	permissao_id: number;
}
