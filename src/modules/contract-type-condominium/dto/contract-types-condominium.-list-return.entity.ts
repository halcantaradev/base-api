import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ContractTypesCondominium } from '../entities/contract-types-condominium.entity';

export class ContractTypesCondominiumListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ContractTypesCondominium,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: ContractTypesCondominium[];
}
