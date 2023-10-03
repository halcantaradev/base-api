import { Module } from '@nestjs/common';
import { QueueGeneratePackageService } from './queue-generate-package.service';
import { QueueGeneratePackageController } from './queue-generate-package.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [QueueGeneratePackageController],
	providers: [QueueGeneratePackageService, PrismaService],
})
export class QueueGeneratePackageModule {}
