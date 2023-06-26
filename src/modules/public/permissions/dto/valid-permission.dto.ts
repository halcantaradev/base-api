import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidPermissionDTO {
	@ApiProperty({
		description: 'Ação que deve ser checada',
		example: 'usuarios-listar-todos',
		required: true,
	})
	@IsNotEmpty({
		message: 'Informe a ação a ser checada',
	})
	action: string;
}
