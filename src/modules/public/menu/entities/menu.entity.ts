import { ApiProperty } from '@nestjs/swagger';

class SubMenu {
	@ApiProperty({
		description: 'Id do menu',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Label do menu',
		example: 'Exemplo',
		readOnly: true,
	})
	label: string;

	@ApiProperty({
		description: 'URL do menu',
		example: 'exemplo',
		readOnly: true,
	})
	url: string;

	@ApiProperty({
		description: 'Id da permissão do menu',
		example: 1,
		readOnly: true,
	})
	permissao_id: number;

	@ApiProperty({
		description: 'Icone do menu',
		example: 1,
		readOnly: true,
	})
	icon: string;

	@ApiProperty({
		description: 'Modo de abertura do menu',
		example: 1,
		readOnly: true,
	})
	target: string;

	@ApiProperty({
		description: 'Id do menu principal',
		example: 1,
		readOnly: true,
	})
	menu_id: number;

	@ApiProperty({
		description: 'Status do menu',
		example: true,
		readOnly: true,
	})
	ativo: boolean;
}

export class Menu extends SubMenu {
	@ApiProperty({
		description: 'Submenus do menu',
		type: SubMenu,
		isArray: true,
		readOnly: true,
	})
	items: SubMenu[];
}
