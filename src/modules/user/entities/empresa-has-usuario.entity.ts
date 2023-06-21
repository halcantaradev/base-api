import { ApiProperty } from '@nestjs/swagger';
import { Ocupation } from 'src/modules/ocupations/entities/ocupation.entity';

export class EmpresaHasUsuarioEntity {
	@ApiProperty({
		description: 'Id da empresa do usuário',
		example: 1,
		required: false,
	})
	empresa_id: number;

	@ApiProperty({
		description: 'Dados do cargo do usuario na empresa',
		type: Ocupation,
		required: false,
	})
	cargo: Ocupation;
}
