import {
	Controller,
	Get,
	HttpStatus,
	Query,
	Res,
	StreamableFile,
} from '@nestjs/common';
import { ExternalAccessDocumentsService } from './external-access-documents.service';
import { Response } from 'express';
import {
	ApiOperation,
	ApiProduces,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

@ApiTags('Acesso de Documentos Externos')
@Controller('access-docs')
export class ExternalAccessDocumentsController {
	constructor(
		private readonly externalAccessDocumentsService: ExternalAccessDocumentsService,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Retorna o arquivo solicitado de acordo com a Hash enviada',
	})
	@ApiResponse({
		description: 'Arquivo retornado com sucesso',
		status: HttpStatus.OK,
		schema: {
			type: 'string',
			format: 'binary',
		},
	})
	@ApiProduces('application/pdf')
	async get(
		@Query('doc') token: string,
		@Res({ passthrough: true }) res: Response,
	) {
		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline;',
		});

		return new StreamableFile(
			await this.externalAccessDocumentsService.getDocByToken(token),
		);
	}
}
