import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { S3Service } from 'src/shared/services/s3.service';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
	controllers: [UploadFileController],
	providers: [UploadFileService, S3Service],
	exports: [UploadFileService],
	imports: [PrismaModule],
})
export class UploadFileModule {}
