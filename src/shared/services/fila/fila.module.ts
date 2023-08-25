import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Filas } from 'src/shared/consts/filas.const';

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
	],
	providers: [FilaService],
	exports: [FilaService],
})
export class FilaModule {}
