import { ApiProperty } from '@nestjs/swagger';
import { EmpresaHasUsuarioEntity } from './empresa-has-usuario.entity';
import { UsuarioHasDepartamento } from './usuario-has-departamento.entity';

export class UserEntity {
	@ApiProperty({
		description: 'Id do usuário',
		example: 1,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Email de acesso do usuário',
		example: 'usuario@exemplo.com',
		required: true,
	})
	email: string;

	@ApiProperty({
		description: 'Nome do usuário',
		example: 'Usuario Teste',
		required: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Username de acesso do usuário',
		example: 'usuario.exemplo',
		required: true,
	})
	username: string;

	@ApiProperty({
		description: 'Senha de acesso do usuário',
		example: '123456',
		required: false,
	})
	password?: string;

	@ApiProperty({
		description: 'Situação atual do usuário',
		example: true,
		required: true,
	})
	ativo: boolean;

	@ApiProperty({
		description: 'Ultima data de atualização do usuário',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
	})
	updated_at: Date;

	@ApiProperty({
		description: 'Dados da Empresa do usuário',
		type: EmpresaHasUsuarioEntity,
		isArray: true,
		required: true,
	})
	empresas: EmpresaHasUsuarioEntity[];

	@ApiProperty({
		description: 'Dados dos departamentos do usuário',
		type: UsuarioHasDepartamento,
		isArray: true,
		required: true,
	})
	departamentos: UsuarioHasDepartamento[];

	@ApiProperty({
		description: 'Status do usuário',
		example: true,
		required: false,
	})
	acessa_todos_departamentos?: boolean;
}
