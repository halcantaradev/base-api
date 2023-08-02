import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionsDto {
	@ApiProperty({
		description: 'Ids das permissões a serem condecidas',
		required: true,
		isArray: true,
		example: [1, 2],
	})
	@IsNotEmpty({
		message: 'Informe pelo menos uma permissão',
	})
	permissoes: number[];
}
