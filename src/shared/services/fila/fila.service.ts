import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Filas } from 'src/shared/consts/filas.const';

@Injectable()
export class FilaService {
	logService: ClientRMQ;
	constructor(
		@Inject('EMAIL_SERVICE') private readonly emailService?: ClientRMQ,
		@Inject('NOTIFICACAO_SERVICE')
		private readonly notificationService?: ClientRMQ,
	) {
		this.logService = new ClientRMQ({
			urls: [
				`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
			],
			queue: Filas.LOGS + '-' + process.env.PREFIX_EMPRESA,
			noAck: true,
			persistent: true,
			queueOptions: {},
		});
	}

	publishNotification(pattern: string, payload: any): Promise<boolean> {
		return new Promise((res, rej) => {
			this.notificationService
				.emit(pattern, payload)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}

	publishEmail(pattern: string, payload: any): Promise<boolean> {
		return new Promise((res, rej) => {
			this.emailService
				.emit(pattern, payload)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}

	publishLog(pattern: string, payload: any) {
		return this.logService.emit(pattern, payload);
	}
}
