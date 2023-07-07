import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';

@Injectable()
export class HandlebarsService {
	compile(layout: string, data: any) {
		return Handlebars.compile(layout)(data);
	}
}
