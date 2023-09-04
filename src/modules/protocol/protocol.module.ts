import { Module } from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { PersonModule } from '../person/person.module';
import { ProtocolController } from './protocol.controller';
import { PdfService } from 'src/shared/services/pdf.service';
import { EmailService } from 'src/shared/services/email.service';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { PrismaService } from 'src/shared/services/prisma.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';

@Module({
	imports: [PersonModule, FilaModule, ExternalJwtModule],
	controllers: [ProtocolController],
	providers: [
		PdfService,
		EmailService,
		PrismaService,
		ProtocolService,
		HandlebarsService,
		LayoutConstsService,
	],
	exports: [ProtocolService],
})
export class ProtocolModule {}
