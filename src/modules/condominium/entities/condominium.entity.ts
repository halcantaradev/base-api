import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/modules/person/entities/person.entity';
import { CondominioHasDepartamento } from './condominio-has-departamento.entity';
import { CondominioAdministracao } from './condominio-administracao.entity';
import { ContractsCondominiumType } from 'src/modules/condominium/entities/contracts-condominium-type.entity';

export class Condominium extends Person {
	@ApiProperty({
		description: 'Dados dos departamentos do condominio',
		type: CondominioHasDepartamento,
		isArray: true,
		required: false,
	})
	departamentos_condominio: CondominioHasDepartamento[];

	@ApiProperty({
		description: 'Dados da administração do condominio',
		type: CondominioAdministracao,
		isArray: true,
		required: false,
	})
	condominio_administracao: CondominioAdministracao[];

	@ApiProperty({
		description: 'Dados do contrato do condominio',
		type: ContractsCondominiumType,
		required: false,
	})
	tipo_contrato: ContractsCondominiumType;
}
