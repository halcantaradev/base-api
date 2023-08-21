import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { Agent } from 'https';
import { Filas } from '../consts/filas.const';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoggerService {
	headers: AxiosHeaders;
	baseURL: string;
	constructor(private readonly httpService: HttpService) {
		this.baseURL = process.env.QUEUE_URL;
		this.headers = new AxiosHeaders({
			'Content-Type': 'application/json',
			Authorization: process.env.QUEUE_TOKEN,
		});
	}

	async send(
		ip: string,
		agent: string,
		route: string,
		method: string,
		userId: number,
		empresaId: number,
		query: object = {},
		param: object = {},
		body: object = {},
		responseStatus: number,
		responseMessage: string | string[] | undefined,
	): Promise<boolean> {
		try {
			const queueBody = {
				user: {
					ip,
					id: userId,
					empresaId,
				},
				request: {
					route,
					agent,
					method,
					query,
					param,
					body,
				},
				reponse: {
					status: responseStatus,
					message: responseMessage,
				},
				datetime: new Date(),
			};

			console.log(
				`[${new Date().toLocaleString()}] ${method} ${route} ${responseStatus}`,
			);

			await firstValueFrom(
				this.httpService.post(
					`${this.baseURL}/${Filas.LOGS}-${process.env.PREFIX_EMPRESA}`,
					queueBody,
					{
						headers: this.headers,
						httpsAgent: new Agent({
							rejectUnauthorized: false,
						}),
					},
				),
			);

			return true;
		} catch {
			return false;
		}
	}
}