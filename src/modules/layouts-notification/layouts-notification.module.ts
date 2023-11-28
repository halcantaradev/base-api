import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { LayoutsNotificationController } from './layouts-notification.controller';
import { LayoutsNotificationService } from './layouts-notification.service';

@Module({
	imports: [PrismaModule],
	controllers: [LayoutsNotificationController],
	providers: [LayoutsNotificationService],
})
export class LayoutsNotificationModule {}
