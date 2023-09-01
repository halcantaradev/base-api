import { Module } from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { PersonModule } from '../person/person.module';
import { ProtocolController } from './protocol.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { PdfService } from 'src/shared/services/pdf.service';

@Module({
	imports: [PersonModule],
	controllers: [ProtocolController],
	providers: [
		ProtocolService,
		PrismaService,
		LayoutConstsService,
		HandlebarsService,
		PdfService,
	],
})
export class ProtocolModule {}
