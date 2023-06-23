import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';

class PermissionUser {
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
		description: 'Usuário com a permissão',
		example: [{ usuario_id: 1 }],
		required: false,
		readOnly: true,
	})
	usuario_has_permissoes: Array<{ cargo_id: number }>;
}

export class PermissionUserReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: PermissionUser,
		readOnly: true,
		required: false,
		isArray: true,
	})
	data: PermissionUser;

	@ApiProperty({
		description: 'Mensagem de retorno',
		writeOnly: true,
	})
	message?: string;
}
