import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Protocol } from './protocol.entity';

export class ProtocolReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Protocol,
		readOnly: true,
		required: false,
	})
	data: Protocol;
}
