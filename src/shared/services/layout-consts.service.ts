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
		const html: Buffer | string = readFileSync(
			resolve('./src/shared/layouts/' + tpl),
		);

		return html.toString();
	}
}
