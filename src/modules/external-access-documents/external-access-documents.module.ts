import { Module } from '@nestjs/common';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { NotificationModule } from '../notification/notification.module';
import { ExternalAccessDocumentsController } from './external-access-documents.controller';
import { ExternalAccessDocumentsService } from './external-access-documents.service';
import { PdfService } from 'src/shared/services/pdf.service';

@Module({
	imports: [NotificationModule, ExternalJwtModule],
	controllers: [ExternalAccessDocumentsController],
	providers: [
		ExternalAccessDocumentsService,
		HandlebarsService,
		LayoutConstsService,
		PdfService,
	],
	exports: [ExternalAccessDocumentsService],
})
export class ExternalAccessDocumentsModule {}
