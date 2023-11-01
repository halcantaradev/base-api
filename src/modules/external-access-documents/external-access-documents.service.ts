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
		let dataToPrint: any;
		let pdfs = [];
		let pdf: Buffer;

		let generateFileName = '';

		if (data.origin == 'notificacoes') {
			generateFileName = 'Notificação';

			const notificacao = await this.notificationService.findOneById(
				data.data.id,
			);

			pdf = await this.pdfService.getPDF(notificacao.doc_gerado);

			pdfs = await this.notificationService.getPDFFiles(data.data.id);
		}

		if (data.origin == 'protocolos') {
			generateFileName = 'Protocolo';

			let html: Buffer | string = readFileSync(
				resolve('./src/shared/layouts/protocolo.html'),
			);

			dataToPrint = await this.protocolService.dataToHandle(data.data.id);
			const layout = this.layoutService.replaceLayoutVars(
				html.toString(),
			);

			html = this.handleBarService.compile(layout, dataToPrint);
			pdf = await this.pdfService.getPDF(html);
		}

		if (generateFileName != '') {
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
