import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { NotificationEventsService } from './notification-events.service';
import { NotificationEventsController } from './notification-events.controller';
import { FilaModule } from 'src/shared/services/fila/fila.module';

@Module({
	imports: [FilaModule],
	controllers: [NotificationEventsController],
	providers: [NotificationEventsService, PrismaService],
})
export class NotificationEventsModule {}
