import { Module } from '@nestjs/common';
import { EmailService } from 'src/shared/services/email.service';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { NotificationEventsModule } from '../notification-events/notification-events.module';
import { PersonModule } from '../person/person.module';
import { ProtocolController } from './protocol.controller';
import { ProtocolService } from './protocol.service';

@Module({
	imports: [
		FilaModule,
		PersonModule,
		ExternalJwtModule,
		NotificationEventsModule,
		PrismaModule,
	],
	controllers: [ProtocolController],
	providers: [
		PdfService,
		EmailService,
		ProtocolService,
		HandlebarsService,
		LayoutConstsService,
	],
	exports: [ProtocolService],
})
export class ProtocolModule {}
