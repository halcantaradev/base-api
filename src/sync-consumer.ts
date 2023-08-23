import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Filas } from './shared/consts/filas.const';
import { IntegrationModule } from './modules/integration/integration.module';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		IntegrationModule,
		{
			transport: Transport.RMQ,
			options: {
				urls: [
					`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.QUEUE_URL}`,
				],
				queue: Filas.SYNC_INSERT + '-' + process.env.PREFIX_EMPRESA,
				noAck: true,
				persistent: false,
				queueOptions: {},
			},
		},
	);

	app.listen().then(() => console.log('Sync consumer is running'));
}
bootstrap();
