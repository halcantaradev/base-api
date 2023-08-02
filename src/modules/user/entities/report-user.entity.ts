import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class ReportUser {
	@ApiProperty({
		description: 'Id do agrupamento',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Descrição do agrupamento',
		example: 'Agrupamento Teste',
		readOnly: true,
	})
	descricao: string;

	@ApiProperty({
		description: 'Dados que serão retornados',
		type: UserEntity,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: UserEntity[];
}
