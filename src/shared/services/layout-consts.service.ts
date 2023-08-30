import { Injectable } from '@nestjs/common';
import { layoutConst } from '../consts/layout.const';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class LayoutConstsService {
	replaceLayoutVars(layout: string) {
		layoutConst.forEach((item) => {
			if (item.template) {
				layout = layout.replaceAll(
					item.const,
					this.mountTemplate(item.template),
				);
			} else {
				layout = layout.replaceAll(item.const, item.field);
			}
		});

		return layout;
	}

	mountTemplate(tpl: string) {
		let html: string = readFileSync(
			resolve('./src/shared/layouts/' + tpl),
		).toString();

		layoutConst.forEach((item) => {
			html = html.replaceAll(item.const, item.field);
		});
		return html;
	}

	getTemplat(layoutPath: string) {
		return readFileSync(
			resolve('./src/shared/layouts/' + layoutPath),
		).toString();
	}
}
