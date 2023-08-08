import { ApiProperty } from '@nestjs/swagger';
import { Department } from 'src/modules/department/entities/department.entity';
import { Ocupation } from 'src/modules/ocupations/entities/ocupation.entity';

export class UsuariosCondominio {
	@ApiProperty({
		description: 'Id do responsável',
		example: 1,
		required: false,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do responsável',
		type: String,
		example: 'Francisco',
		required: false,
	})
	nome: string;

	@ApiProperty({
		description: 'Cargo do responsável',
		type: Ocupation,
		required: false,
	})
	cargo?: Ocupation;

	@ApiProperty({
		description: 'Cargo do responsável',
		type: Department,
		required: false,
	})
	departamento?: Department;

	@ApiProperty({
		description: 'Ramal do responsável',
		example: '45103',
		required: false,
	})
	ramal?: string;

	@ApiProperty({
		description: 'Telefone do responsável',
		example: '(99) 999999999',
		required: false,
	})
	telefone: string;

	@ApiProperty({
		description: 'Whatsapp do responsável',
		example: '(99) 999999999',
		required: false,
	})
	whatsapp?: string;
}
