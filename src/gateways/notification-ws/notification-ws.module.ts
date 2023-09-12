import { Module } from '@nestjs/common';
import { NotificationWSGateway } from './notification-ws.gateway';
import { NotificationWSService } from './notification-ws.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationWSController } from './notification-ws.controller';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: { expiresIn: '1d' },
		}),
	],
	providers: [NotificationWSGateway, NotificationWSService, PrismaService],
	controllers: [NotificationWSController],
})
export class NotificationWSModule {}
