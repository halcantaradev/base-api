import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionOcupationDto {
	@ApiProperty({
		description: 'Id do cargo para conceder permissão',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message: 'Informe o cargo',
	})
	cargo_id: number;

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
	createdAt?: string | Date;
	updateda_at?: string | Date;
}
