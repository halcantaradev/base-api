import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { ExternalAccessDocumentsService } from './external-access-documents.service';
import { Response } from 'express';

@Controller('access-docs')
export class ExternalAccessDocumentsController {
	constructor(
		private readonly externalAccessDocumentsService: ExternalAccessDocumentsService,
	) {}

	@Get()
	async get(
		@Query('doc') token: string,
		@Res({ passthrough: true }) res: Response,
	) {
		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="Notificação.pdf"',
		});
		return new StreamableFile(
			await this.externalAccessDocumentsService.getDocByToken(token),
		);
	}
}
