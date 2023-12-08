import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Filas } from 'src/shared/consts/filas.const';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { GlobalModule } from '../global/global.module';
import { PermissionsModule } from '../public/permissions/permissions.module';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

@Module({
	controllers: [IntegrationController],
	imports: [
		GlobalModule,
		ExternalJwtModule,
		HttpModule,
		FilaModule,
		PermissionsModule,
		PrismaModule,
		ClientsModule.register([
			{
				name: 'NOTIFICACAO_CONSUMER_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue:
						Filas.NOTIFICATION + '-' + process.env.PREFIX_EMPRESA,
					noAck: true,
					persistent: true,
				},
			},
			{
				name: 'SYNC_ERROR_LOG_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue:
						'gestaoweb-sync-erro-log-' + process.env.PREFIX_EMPRESA,
					noAck: true,
					persistent: true,
				},
			},
			{
				name: 'SYNC_GENERIC_LOG_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_URL}`,
					],
					queue:
						'gestaoweb-sync-generic-log-' +
						process.env.PREFIX_EMPRESA,
					noAck: true,
					persistent: true,
				},
			},
		]),
	],
	providers: [IntegrationService],
	exports: [IntegrationService],
})
export class IntegrationModule {}
