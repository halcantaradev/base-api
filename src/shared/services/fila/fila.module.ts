import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Filas } from 'src/shared/consts/filas.const';
import { EmailService } from '../email.service';
import { NotificationWsService } from '../notification-ws.service';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'SYNC_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue: Filas.SYNC,
					noAck: true,
					persistent: true,
					queueOptions: {},
				},
			},
		]),
		ClientsModule.register([
			{
				name: 'EMAIL_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue: Filas.EMAIL,
					noAck: true,
					persistent: true,
					queueOptions: {},
				},
			},
		]),
		ClientsModule.register([
			{
				name: 'NOTIFICACAO_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue: Filas.NOTIFICATION,
					noAck: true,
					persistent: true,
					queueOptions: {},
				},
			},
		]),
	],
	providers: [FilaService, EmailService, NotificationWsService],
	exports: [FilaService, EmailService, NotificationWsService],
})
export class FilaModule {}
