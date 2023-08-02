import { Injectable } from '@nestjs/common';
import { layoutConst } from '../consts/layout.const';

@Injectable()
export class LayoutConstsService {
	replaceLayoutVars(modelo: string) {
		layoutConst.forEach((item) => {
			modelo = modelo.replaceAll(item.const, item.field);
		});

		return modelo;
	}
}
