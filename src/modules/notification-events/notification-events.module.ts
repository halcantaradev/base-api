import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { NotificationEventsService } from './notification-events.service';
import { NotificationEventsController } from './notification-events.controller';

@Module({
	controllers: [NotificationEventsController],
	providers: [NotificationEventsService, PrismaService],
})
export class NotificationEventsModule {}
