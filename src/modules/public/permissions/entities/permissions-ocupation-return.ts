import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';

class PermissionOcupation {
	@ApiProperty({
		description: 'Id do registro',
		example: '1',
		required: false,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Label da permissão',
		example: 'Listar todos os usuários',
		required: false,
		readOnly: true,
	})
	label: string;

	@ApiProperty({
		description: 'Cargos com a permissão',
		example: [{ cargo_id: 1 }],
		required: false,
		readOnly: true,
	})
	cargos_has_permissoes: Array<{ cargo_id: number }>;
}

export class PermissionOcupationReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: PermissionOcupation,
		readOnly: true,
		required: false,
		isArray: true,
	})
	data: PermissionOcupation;

	@ApiProperty({
		description: 'Mensagem de retorno',
		writeOnly: true,
	})
	message?: string;
}
