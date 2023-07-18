import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { CondominiumService } from '../condominium/condominium.service';
import { PersonService } from '../person/person.service';
import { SetupService } from '../setup/setup.service';
import { InfractionService } from './infraction/infraction.service';
import { InfractionController } from './infraction/infraction.controller';

@Module({
	controllers: [NotificationController, InfractionController],
	providers: [
		NotificationService,
		PrismaService,
		LayoutConstsService,
		HandlebarsService,
		PdfService,
		CondominiumService,
		PersonService,
		SetupService,
		InfractionService,
	],
})
export class NotificationModule {}
