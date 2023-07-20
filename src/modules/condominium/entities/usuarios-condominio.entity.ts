import { ApiProperty } from '@nestjs/swagger';
import { Ocupation } from 'src/modules/ocupations/entities/ocupation.entity';

export class UsuariosCondominio {
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
}
