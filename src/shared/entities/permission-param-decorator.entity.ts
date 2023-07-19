import { ApiProperty } from '@nestjs/swagger';

export class PermissionParamDecorator {
	@ApiProperty({
		description: 'Nome da permissão',
		example: 'listar-usuarios',
		required: true,
		readOnly: true,
	})
	role: string;

	@ApiProperty({
		description: 'Nome do parâmetro',
		example: 'usuario_id',
		required: false,
		readOnly: true,
	})
	param?: string;

	@ApiProperty({
		description: 'Forma de envio do parâmetro',
		example: 'query',
		required: false,
		readOnly: true,
	})
	param_type?: 'query' | 'body' | 'param';
}
