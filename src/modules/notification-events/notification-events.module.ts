import { Module } from '@nestjs/common';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { NotificationEventsController } from './notification-events.controller';
import { NotificationEventsService } from './notification-events.service';

@Module({
	imports: [FilaModule, PrismaModule],
	exports: [NotificationEventsService],
	controllers: [NotificationEventsController],
	providers: [NotificationEventsService],
})
export class NotificationEventsModule {}
