import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmailService } from 'src/shared/services/email.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CondominiumService } from '../condominium/condominium.service';
import { PersonService } from '../person/person.service';
import { SetupService } from '../setup/setup.service';
import { InfractionController } from './infraction/infraction.controller';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { InfractionService } from './infraction/infraction.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { S3Service } from 'src/shared/services/s3.service';
import { LayoutsNotificationService } from '../layouts-notification/layouts-notification.service';
import { FilaModule } from 'src/shared/services/fila/fila.module';

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
		EmailService,
		S3Service,
		LayoutsNotificationService,
	],
	imports: [HttpModule, ExternalJwtModule, UploadFileModule, FilaModule],
	exports: [NotificationService],
})
export class NotificationModule {}
