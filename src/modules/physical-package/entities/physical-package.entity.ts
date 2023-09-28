import { ApiProperty } from '@nestjs/swagger';

export class PhysicalPackage {
	@ApiProperty({ example: 1, description: 'O ID do malote físico' })
	id: number;

	@ApiProperty({
		example: '000123',
		description: 'O código do malote físico',
	})
	codigo: string;

	@ApiProperty({
		example: true,
		description: 'Indica se o malote físico está disponível',
	})
	disponivel: boolean;

	@ApiProperty({ example: 1, description: 'A situação do malote físico' })
	situacao: number;

	@ApiProperty({
		example: 1,
		description: 'O ID da empresa associada ao malote físico',
	})
	empresa_id: number;

	@ApiProperty({
		example: false,
		description: 'Indica se o malote físico possui alerta',
	})
	alerta: boolean;

	@ApiProperty({
		example: false,
		description: 'Indica se o malote físico foi excluído',
	})
	excluido: boolean;

	@ApiProperty({
		example: '2022-01-01T00:00:00Z',
		description: 'A data de criação do malote físico',
	})
	create_at: Date;

	@ApiProperty({
		example: '2022-01-01T00:00:00Z',
		description: 'A data de atualização do malote físico',
	})
	update_at: Date;
}
