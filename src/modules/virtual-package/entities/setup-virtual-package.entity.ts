import { ApiProperty } from '@nestjs/swagger';

export class SetupVirtualPackage {
	@ApiProperty({
		description: 'Identifica se a empresa obriga malote físico',
		example: { codigo: 1 },
		readOnly: true,
	})
	obriga_malote_fisico: boolean;
}
