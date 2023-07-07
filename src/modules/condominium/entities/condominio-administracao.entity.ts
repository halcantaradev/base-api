import { Prisma } from '@prisma/client';
import { Condominium } from './condominium.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CargoCondominio } from './cargos-condominio.entity';

export class CondominioAdministracao {
	@ApiProperty({
		description: 'Nome do membro da administração',
		type: String,
		example: 'Francisco',
		required: false,
	})
	nome: string;

	@ApiProperty({
		description: 'Cargo do membro da administração',
		type: CargoCondominio,
		required: false,
	})
	cargo?: CargoCondominio;
}
