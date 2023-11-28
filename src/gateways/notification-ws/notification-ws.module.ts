import { Module } from '@nestjs/common';
import { NotificationWSGateway } from './notification-ws.gateway';
import { NotificationWSService } from './notification-ws.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationWSController } from './notification-ws.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: { expiresIn: '1d' },
		}),
		PrismaModule,
	],
	providers: [NotificationWSGateway, NotificationWSService],
	controllers: [NotificationWSController],
})
export class NotificationWSModule {}
