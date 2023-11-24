import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelProtocolDto {
	@ApiProperty({
		description: 'Motivo do cancelamento',
		example: 'Motivo de cancelamento teste',
		required: false,
	})
	@IsString({
		message:
			'Motivo do cancelamento inválido, por favor forneca um valor válido',
	})
	@MinLength(10, {
		message: 'Motivo do cancelamento deve ter pelo menos 10 caracteres',
	})
	@IsNotEmpty({
		message: 'Motivo do cancelamento não pode ser vazio',
	})
	motivo_cancelado: string;
}
