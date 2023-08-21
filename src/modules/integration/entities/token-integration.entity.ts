import { ApiProperty } from '@nestjs/swagger';

export class IntegrationToken {
	@ApiProperty({
		description: 'Token gerado',
		type: String,
		readOnly: true,
		required: true,
		example:
			'dfsdfgdsf sdfhgsdfhhrtwpkoojsdfvfhsdfhsdfh.fhsdfhsdfhsdfhsdfh.dfhk',
	})
	api_token: string;

	@ApiProperty({
		description: 'Se expira',
		type: Boolean,
		readOnly: true,
		required: true,
		example: false,
	})
	exp: boolean;
}
