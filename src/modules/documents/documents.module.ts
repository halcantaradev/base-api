import { Module } from '@nestjs/common';
import { DocumentTypeController } from './document-type/document-type.controller';
import { DocumentTypeService } from './document-type/document-type.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [DocumentTypeController],
	providers: [DocumentTypeService, PrismaService],
})
export class DocumentsModule {}
