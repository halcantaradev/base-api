import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSetupCondominiumNotificationFundamentationDto {
	@ApiProperty({
		description: 'Tipo de infração',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O campo tipo de infração informado não é válido. Por favor, forneça um  tipo de infração válido.',
	})
	@Type(() => Number)
	@IsNotEmpty({
		message: 'O campo tipo de infração é obrigatório.',
	})
	tipo_infracao_id: number;

	@ApiProperty({
		description: 'Fundamentação legal',
		example: 'lei n 01 teste',
		required: true,
	})
	@Type(() => String)
	@IsNotEmpty({
		message: 'O campo fundamentação legal é obrigatório.',
	})
	fundamentacao: string;

	@ApiProperty({
		description: 'Condomínio',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	@Type(() => Number)
	@IsNotEmpty({
		message: 'O campo condomínio é obrigatório.',
	})
	condominio_id: number;
}
