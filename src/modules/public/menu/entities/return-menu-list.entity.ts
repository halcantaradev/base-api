import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Menu } from './menu.entity';

export class ReturnMenuList extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Mensagem de retorno',
		writeOnly: true,
	})
	message?: string;

	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Menu,
		readOnly: true,
		required: false,
		isArray: true,
	})
	data: Menu[];
}
