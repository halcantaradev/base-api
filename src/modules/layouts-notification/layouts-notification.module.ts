import { Module } from '@nestjs/common';
import { LayoutsNotificationService } from './layouts-notification.service';
import { LayoutsNotificationController } from './layouts-notification.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [LayoutsNotificationController],
	providers: [LayoutsNotificationService, PrismaService],
})
export class LayoutsNotificationModule {}
