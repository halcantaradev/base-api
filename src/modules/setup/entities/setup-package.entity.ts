import { ApiProperty } from '@nestjs/swagger';

export class SetupPackage {
	@ApiProperty({
		description: 'Rota de entrega de malotes do condomínio',
		example: 1,
		readOnly: true,
		required: true,
	})
	rota_id: number;

	@ApiProperty({
		description:
			'Motorista que realiza a rota de entrega de malotes do condomínio',
		example: 1,
		readOnly: true,
		required: true,
	})
	motoqueiro_id: number;

	@ApiProperty({
		description:
			'Quantidade de malotes que podem ficar alocados no condomínio',
		example: 1,
		readOnly: true,
		required: true,
	})
	quantidade_malotes: number;
}
