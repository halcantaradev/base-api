import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/modules/person/entities/person.entity';
import { CondominioHasDepartamento } from './condominio-has-departamento.entity';

export class Condominium extends Person {
	@ApiProperty({
		description: 'Dados dos departamentos do condominio',
		type: CondominioHasDepartamento,
		isArray: true,
		required: false,
	})
	departamentos_condominio: CondominioHasDepartamento[];
}
