import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { DocumentTypeController } from './document-type/document-type.controller';
import { DocumentTypeService } from './document-type/document-type.service';

@Module({
	controllers: [DocumentTypeController],
	providers: [DocumentTypeService],
	imports: [PrismaModule],
})
export class DocumentsModule {}
