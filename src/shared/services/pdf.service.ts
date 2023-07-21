import { Injectable } from '@nestjs/common';
import { generatePdf } from 'html-pdf-node';
@Injectable()
export class PdfService {
	getPDF(html: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			generatePdf(
				{ content: html, url: '' },
				{
					format: 'A4',
					margin: { top: 20, bottom: 20, left: 20, right: 20 },
				},
				(err, buffer) => {
					if (err) {
						reject(err);
					} else resolve(buffer);
				},
			);
		});
	}
	getPDFBuffer(html: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			generatePdf(
				{ content: html, url: 'http://localhost:3002' },
				{
					format: 'A4',
					margin: { top: 20, bottom: 20, left: 20, right: 20 },
				},
				(err, buffer) => {
					if (err) {
						reject(err);
					} else resolve(buffer);
				},
			);
		});
	}
}
