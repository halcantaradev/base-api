import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { NotificationService } from '../notification/notification.service';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { ProtocolService } from '../protocol/protocol.service';

@Injectable()
export class ExternalAccessDocumentsService {
	constructor(
		private externalJwtService: ExternalJwtService,
		private readonly handleBarService: HandlebarsService,
		private readonly layoutService: LayoutConstsService,
		private readonly pdfService: PdfService,
		private readonly notificationService: NotificationService,
		private readonly protocolService: ProtocolService,
	) {}

	async getDocByToken(token: string): Promise<Buffer | null> {
		const data = this.externalJwtService.validateToken(token);
		let html: Buffer | string;
		let pdfs = [];

		let generateFileName = '';

		if (data.origin == 'notificacoes') {
			generateFileName = 'Notificação';

			html = readFileSync(
				resolve('./src/shared/layouts/notification.html'),
			);

			pdfs = await this.notificationService.getPDFFiles(data.data.id);
		}

		if (data.origin == 'protocolos') {
			generateFileName = 'Protocolo';

			html = readFileSync(resolve('./src/shared/layouts/protocolo.html'));
		}

		const layout = this.layoutService.replaceLayoutVars(html.toString());

		const dataToPrint = await this.protocolService.dataToHandle(
			data.data.id,
		);

		html = this.handleBarService.compile(layout, dataToPrint);

		if (generateFileName != '') {
			const pdf = await this.pdfService.getPDF(html);

			if (pdfs.length)
				return await this.pdfService.mergePDFs(
					[pdf, ...pdfs],
					generateFileName,
				);
			else return pdf;
		}

		return null;
	}
}
