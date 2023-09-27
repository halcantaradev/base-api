import { ApiProperty } from '@nestjs/swagger';
import {
	IsInt,
	IsNotEmpty,
	IsString,
	IsBoolean,
	IsDate,
} from 'class-validator';

export class PhysicalPackage {
	@ApiProperty({ example: 1, description: 'O ID do pacote físico' })
	@IsInt({ message: 'O campo ID deve ser um número inteiro' })
	id: number;

	@ApiProperty({
		example: '000123',
		description: 'O código do pacote físico',
	})
	@IsNotEmpty({ message: 'O campo código é obrigatório' })
	@IsString({ message: 'O campo código deve ser uma string' })
	codigo: string;

	@ApiProperty({
		example: true,
		description: 'Indica se o pacote físico está disponível',
	})
	@IsBoolean({ message: 'O campo disponivel deve ser um valor booleano' })
	disponivel: boolean;

	@ApiProperty({ example: 1, description: 'A situação do pacote físico' })
	@IsInt({ message: 'O campo situação deve ser um número inteiro' })
	situacao: number;

	@ApiProperty({
		example: 1,
		description: 'O ID da empresa associada ao pacote físico',
	})
	@IsInt({ message: 'O campo empresa_id deve ser um número inteiro' })
	empresa_id: number;

	@ApiProperty({
		example: false,
		description: 'Indica se o pacote físico possui alerta',
	})
	@IsBoolean({ message: 'O campo alerta deve ser um valor booleano' })
	alerta: boolean;

	@ApiProperty({
		example: false,
		description: 'Indica se o pacote físico foi excluído',
	})
	@IsBoolean({ message: 'O campo excluido deve ser um valor booleano' })
	excluido: boolean;

	@ApiProperty({
		example: '2022-01-01T00:00:00Z',
		description: 'A data de criação do pacote físico',
	})
	@IsNotEmpty({ message: 'O campo create_at é obrigatório' })
	@IsDate({ message: 'O campo create_at deve ser uma data válida' })
	create_at: Date;

	@ApiProperty({
		example: '2022-01-01T00:00:00Z',
		description: 'A data de atualização do pacote físico',
	})
	@IsNotEmpty({ message: 'O campo update_at é obrigatório' })
	@IsDate({ message: 'O campo update_at deve ser uma data válida' })
	update_at: Date;
}
