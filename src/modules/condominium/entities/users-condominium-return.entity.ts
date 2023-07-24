import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UsuariosCondominio } from './usuarios-condominio.entity';

export class UsersCondominiumReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: UsuariosCondominio,
		readOnly: true,
		required: false,
	})
	data: UsuariosCondominio;
}
