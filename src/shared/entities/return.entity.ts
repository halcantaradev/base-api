import { ApiProperty } from '@nestjs/swagger';

export class ReturnEntity {
	static success(msg = 'Mensagem teste') {
		class ReturnSuccessObject {
			@ApiProperty({
				description: 'Sucesso da requisição',
				example: true,
				required: true,
				readOnly: true,
			})
			success: boolean;

			@ApiProperty({
				description: 'Mensagem do retorno',
				example: msg,
				readOnly: true,
				required: false,
			})
			message?: string;

			data: any;

			total_pages?: number;
		}

		return ReturnSuccessObject;
	}

	static error(msg = 'Mensagem teste') {
		class ReturnErrorObject {
			@ApiProperty({
				description: 'Sucesso da requisição',
				example: false,
				required: true,
				readOnly: true,
			})
			success: boolean;

			@ApiProperty({
				description: 'Mensagem do retorno',
				example: msg,
				readOnly: true,
				required: false,
			})
			message?: string;
		}

		return ReturnErrorObject;
	}
}
