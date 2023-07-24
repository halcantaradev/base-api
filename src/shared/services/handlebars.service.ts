import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';

@Injectable()
export class HandlebarsService {
	constructor() {
		Handlebars.registerHelper(
			'ifEquals',
			function (arg1: string | number, arg2: string | number, options) {
				return arg1 == arg2 ? options.fn(this) : options.inverse(this);
			},
		);
	}
	compile(layout: string, data: any) {
		return Handlebars.compile(layout)(data);
	}
}
