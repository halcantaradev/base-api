import { Injectable } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { Email } from '../types';
import { FilaService } from './fila/fila.service';

@Injectable()
export class EmailService {
	headers: AxiosHeaders;
	baseURL: string;
	constructor(private readonly filaService: FilaService) {}

	send(email: Email): Promise<boolean> {
		return new Promise((res, rej) => {
			this.filaService
				.publishEmail('', email)
				.then(() => res(true))
				.catch((err) => rej(err));
		});
	}
}
