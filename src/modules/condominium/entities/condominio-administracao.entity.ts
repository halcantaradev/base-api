import { Prisma } from '@prisma/client';
import { Condominium } from './condominium.entity';
import { ApiProperty } from '@nestjs/swagger';

class CargoCondominio {
	@ApiProperty({
		description: 'Nome do cargo no condominio',
		type: String,
		example: 'Síndico',
		required: false,
	})
	nome: string;
	@ApiProperty({
		description: 'Se é síndico do condominio',
		type: String,
		example: true,
		required: false,
	})
	sindico: boolean;
}

export class CondominioAdministracao {
	id?: number;

	@ApiProperty({
		description: 'Nome do membro da administração',
		type: String,
		example: 'Francisco',
		required: false,
	})
	nome: string;

	createdAt?: string | Date;
	updated_at?: string | Date;
	condominio?: Condominium;

	@ApiProperty({
		description: 'Cargo do membro da administração',
		type: CargoCondominio,
		required: false,
	})
	cargo?: CargoCondominio;
}
