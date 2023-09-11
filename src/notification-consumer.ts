import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Filas } from './shared/consts/filas.const';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationWSModule } from './gateways/notification-ws/notification-ws.module';

async function bootstrap() {
	const notificationConsumer =
		await NestFactory.createMicroservice<MicroserviceOptions>(
			NotificationWSModule,
			{
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue: Filas.NOTIFICATION,
					noAck: true,
					persistent: false,
					queueOptions: {},
				},
			},
		);

	notificationConsumer
		.listen()
		.then(() => console.log('Notification consumer is running'));
}
bootstrap();
