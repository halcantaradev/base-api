import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IntegrationToken } from './token-integration.entity';

export class IntegrationTokenReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados retornados',
		type: IntegrationToken,
		readOnly: true,
		required: true,
	})
	data: IntegrationToken;
}
