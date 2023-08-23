import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { Agent } from 'https';
import { Email } from '../types';
import { Filas } from '../consts/filas.const';

@Injectable()
export class EmailService {
	headers: AxiosHeaders;
	baseURL: string;
	constructor(private readonly httpService: HttpService) {
		this.baseURL = process.env.EMAIL_SEND_URL;
		this.headers = new AxiosHeaders({
			'Content-Type': 'application/json',
			Authorization: process.env.EMAIL_SEND_TOKEN,
		});
	}

	send(email: Email): Promise<boolean> {
		return new Promise((res, rej) => {
			this.httpService
				.post(
					`${this.baseURL}/${Filas.EMAIL}-${process.env.PREFIX_EMPRESA}`,
					email,
					{
						headers: this.headers,
						httpsAgent: new Agent({
							rejectUnauthorized: false,
						}),
					},
				)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}
}
