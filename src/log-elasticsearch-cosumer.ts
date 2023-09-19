import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Filas } from './shared/consts/filas.const';
import { LogElasticsearchModule } from './consumers/log-elasticsearch/log-elasticsearch.module';

async function bootstrap() {
	const logConsumer =
		await NestFactory.createMicroservice<MicroserviceOptions>(
			LogElasticsearchModule,
			{
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue: Filas.LOGS + '-' + process.env.PREFIX_EMPRESA,
					noAck: true,
					persistent: false,
					queueOptions: {},
				},
			},
		);

	logConsumer
		.listen()
		.then(() => console.log('Log elasticsearch consumer is running'));
}
bootstrap();
