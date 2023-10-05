import { ApiProperty } from '@nestjs/swagger';

export class PhysicalPackageVirtualPackage {
	@ApiProperty({
		description: 'Id do malote físico',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'O código do malote físico',
		example: '123456',
		required: true,
	})
	codigo: string;

	@ApiProperty({
		description: 'Indica se o malote físico é do tipo alerta',
		example: false,
		required: true,
	})
	alerta: boolean;
}
