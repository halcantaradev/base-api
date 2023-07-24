import { ApiProperty } from '@nestjs/swagger';

export class LayoutConst {
	@ApiProperty({
		description: 'Label da varável',
		example: 'Nome do condomínio',
		required: true,
		readOnly: true,
	})
	label: string;

	@ApiProperty({
		description: 'Tag da constante',
		example: '[NOME_CONDOMINIO]',
		required: true,
		readOnly: true,
	})
	const: string;
}

export type Email = {
	from: string;
	to: string;
	subject: string;
	html: string;
};
