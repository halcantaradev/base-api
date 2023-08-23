import { Module } from '@nestjs/common';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { PrismaService } from 'src/shared/services/prisma.service';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { FilaService } from 'src/shared/services/fila.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Filas } from 'src/shared/consts/filas.const';
import { PermissionsModule } from '../public/permissions/permissions.module';

@Module({
	controllers: [IntegrationController],
	imports: [
		ExternalJwtModule,
		HttpModule,
		PermissionsModule,
		ClientsModule.register([
			{
				name: 'SYNC_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.QUEUE_URL}`,
					],
					queue: Filas.SYNC + '-' + process.env.PREFIX_EMPRESA,
					noAck: true,
					persistent: true,
					queueOptions: {},
				},
			},
		]),
	],
	providers: [IntegrationService, PrismaService, FilaService],
})
export class IntegrationModule {}
