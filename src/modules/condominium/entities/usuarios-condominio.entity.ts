import { ApiProperty } from '@nestjs/swagger';
import { CargoCondominio } from './cargos-condominio.entity';

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
		type: CargoCondominio,
		required: false,
	})
	cargo?: CargoCondominio;
}
