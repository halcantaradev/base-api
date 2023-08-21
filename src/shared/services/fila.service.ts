import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { Agent } from 'https';

@Injectable()
export class FilaService {
	headers: AxiosHeaders;
	baseURL: string;
	constructor(private readonly httpService: HttpService) {
		this.baseURL = process.env.QUEUE_URL;
		this.headers = new AxiosHeaders({
			'Content-Type': 'application/json',
			Authorization: process.env.QUEUE_TOKEN,
		});
	}

	subscribe(fila: string, payload: any): Promise<boolean> {
		return new Promise((res, rej) => {
			this.httpService
				.post(`${this.baseURL}/${fila}`, payload, {
					headers: this.headers,
					httpsAgent: new Agent({
						rejectUnauthorized: false,
					}),
				})
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}
}
