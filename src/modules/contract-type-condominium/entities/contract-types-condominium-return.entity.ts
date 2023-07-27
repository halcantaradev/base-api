import { ApiProperty } from '@nestjs/swagger';
import { ContractTypesCondominium } from './contract-types-condominium.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class ContractTypesCondominiumReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ContractTypesCondominium,
		readOnly: true,
		required: false,
	})
	data: ContractTypesCondominium;
}
