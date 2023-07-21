import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { S3Service } from 'src/shared/services/s3.service';

@Module({
	controllers: [UploadFileController],
	providers: [UploadFileService, PrismaService, S3Service],
})
export class UploadFileModule {}
