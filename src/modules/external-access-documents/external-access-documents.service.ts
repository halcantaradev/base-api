import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { NotificationService } from '../notification/notification.service';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { PdfService } from 'src/shared/services/pdf.service';

@Injectable()
export class ExternalAccessDocumentsService {
	constructor(
		private externalJwtService: ExternalJwtService,
		private readonly handleBarService: HandlebarsService,
		private readonly layoutService: LayoutConstsService,
		private readonly pdfService: PdfService,
		private readonly notificationService: NotificationService,
	) {}

	async getDocByToken(token: string): Promise<Buffer | null> {
		const data = this.externalJwtService.validateToken(token);

		if (data.origin == 'notificacoes') {
			let html: Buffer | string = readFileSync(
				resolve('./src/shared/layouts/notification.html'),
			);

			const layout = this.layoutService.replaceLayoutVars(
				html.toString(),
			);

			const dataToPrint = await this.notificationService.dataToHandle(
				data.data.id,
			);

			html = this.handleBarService.compile(layout, dataToPrint);
			const pdf = await this.pdfService.getPDF(html);
			const pdfs = await this.notificationService.getPDFFiles(
				data.data.id,
			);
			return await this.pdfService.mergePDFs(
				[pdf, ...pdfs],
				'Notificação',
			);
		}
		return null;
	}
}
