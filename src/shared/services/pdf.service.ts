import { Injectable } from '@nestjs/common';
import { generatePdf } from 'html-pdf-node';
import { PDFDocument } from 'pdf-lib';
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

	async setTitlePDF(title: string, pdf: Buffer) {
		const doc = await PDFDocument.load(pdf);
		doc.setTitle(title);
		return Buffer.concat([await doc.save()]);
	}

	async mergePDFs(pdfs: Buffer[], title: string) {
		const pdfMerged = await PDFDocument.create();
		for await (const pdf of pdfs) {
			const p = await PDFDocument.load(pdf);
			const pagesArray = await pdfMerged.copyPages(p, p.getPageIndices());

			for (const page of pagesArray) {
				pdfMerged.addPage(page);
			}
		}

		pdfMerged.setTitle(title);
		const s = await pdfMerged.save({});

		return Buffer.concat([s]);
	}
}
