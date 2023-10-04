import { ApiProperty } from '@nestjs/swagger';

export class SetupVirtualPackage {
	@ApiProperty({
		description: 'Identifica se a empresa usa malote físico',
		example: { codigo: 1 },
		readOnly: true,
	})
	usa_malote_fisico: boolean;
}
