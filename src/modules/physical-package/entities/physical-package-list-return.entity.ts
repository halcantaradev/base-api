import { ApiProperty } from '@nestjs/swagger';
import { PhysicalPackage } from './physical-package.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class PhysicalPackageListReturnEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: PhysicalPackage,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: PhysicalPackage[];

	@ApiProperty({
		description: 'Quantidade de malotes físicos disponíveis',
		type: Number,
		example: 1,
		readOnly: true,
		required: false,
	})
	disponiveis: number;

	@ApiProperty({
		description: 'Quantidade de malotes físicos em uso',
		type: Number,
		example: 1,
		readOnly: true,
		required: false,
	})
	em_uso: number;

	@ApiProperty({
		description: 'Quantidade total de malotes físicos',
		type: Number,
		example: 1,
		readOnly: true,
		required: false,
	})
	total: number;
}
