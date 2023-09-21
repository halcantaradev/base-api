import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { PrismaService } from 'src/shared/services/prisma.service';
import { PermissionsModule } from '../public/permissions/permissions.module';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Filas } from 'src/shared/consts/filas.const';
import { GlobalModule } from '../global/global.module';

@Module({
	controllers: [IntegrationController],
	imports: [
		GlobalModule,
		ExternalJwtModule,
		HttpModule,
		FilaModule,
		PermissionsModule,
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
					queueOptions: {},
				},
			},
		]),
	],
	providers: [IntegrationService, PrismaService],
})
export class IntegrationModule {}
