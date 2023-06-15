import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Permission implements Prisma.PermissoesUncheckedCreateInput {
	@ApiProperty({
		description: 'Id do registro',
		example: '1',
		required: false,
		readOnly: true,
	})
	id?: number;

	@ApiProperty({
		description: 'Label da permissão',
		example: 'Listar todos os usuários',
		required: false,
		readOnly: true,
	})
	label: string;

	@ApiProperty({
		description: 'Key da permissão, correspondente a ação',
		example: 'usuarios-listar-todos',
		required: false,
		readOnly: true,
	})
	key: string;

	@ApiProperty({
		description: 'Mensagem de retorno caso não tenha permissão',
		example: 'Sem permissão para listar todos os usuários',
		required: false,
		readOnly: true,
	})
	message: string;

	@ApiProperty({
		description: 'Permissãoa ativa',
		example: true,
		required: false,
		readOnly: true,
	})
	active?: boolean;

	@ApiProperty({
		description: 'Data da criação',
		example: '2023-01-01T23:59:59.000Z',
		required: false,
		readOnly: true,
	})
	created_at?: string | Date;

	@ApiProperty({
		description: 'Data da atualização',
		example: '2023-01-01T23:59:59.000Z',
		required: false,
		readOnly: true,
	})
	updateda_at?: string | Date;

	@ApiProperty({
		description: 'Cargos com a permissão',
		example: '2023-01-01T23:59:59.000Z',
		required: false,
		readOnly: true,
	})
	cargos_has_ermissoes?: Prisma.CargosHasPermissoesUncheckedCreateNestedManyWithoutPermissaoInput;

	@ApiProperty({
		description: 'Usuários com a permissão',
		example: {
			id: 1,
		},
		required: false,
		readOnly: true,
	})
	usuario_has_permissoes?: Prisma.UsuarioHasPermissoesUncheckedCreateNestedManyWithoutPermissaoInput;
}
