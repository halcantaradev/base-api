import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { PdfService } from 'src/shared/services/pdf.service';

@Module({
	controllers: [NotificationController],
	providers: [
		NotificationService,
		PrismaService,
		LayoutConstsService,
		HandlebarsService,
		PdfService,
	],
})
export class NotificationModule {}
