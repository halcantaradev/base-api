import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateSetupPackageDto {
	@ApiProperty({
		description: 'Rota de entrega de malotes do condomínio',
		example: 1,
		readOnly: true,
		required: true,
	})
	@IsInt({
		message:
			'O campo rota informado não é válido. Por favor, forneça uma rota válida.',
	})
	@IsNotEmpty({
		message: 'O campo rota é obrigatório. Por favor, forneça uma rota.',
	})
	@Type(() => Number)
	rota_id: number;

	@ApiProperty({
		description:
			'Motorista que realiza a rota de entrega de malotes do condomínio',
		example: 1,
		readOnly: true,
		required: true,
	})
	@IsInt({
		message:
			'O campo motorista informado não é válido. Por favor, forneça um motorista válido.',
	})
	@IsNotEmpty({
		message:
			'O campo motorista é obrigatório. Por favor, forneça um motorista.',
	})
	@Type(() => Number)
	motorista_id: number;

	@ApiProperty({
		description:
			'Quantidade de malotes que podem ficar alocados no condomínio',
		example: 1,
		readOnly: true,
		required: true,
	})
	@IsInt({
		message:
			'A quantidade de malotes informada não é válida. Por favor, forneça uma quantidade válida.',
	})
	@IsNotEmpty({
		message:
			'O campo quantidade de malotes é obrigatório. Por favor, forneça uma quantidade.',
	})
	@Type(() => Number)
	quantidade_malotes: number;
}
