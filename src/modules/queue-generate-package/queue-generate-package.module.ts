import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { QueueGeneratePackageController } from './queue-generate-package.controller';
import { QueueGeneratePackageService } from './queue-generate-package.service';

@Module({
	controllers: [QueueGeneratePackageController],
	providers: [QueueGeneratePackageService],
	imports: [PrismaModule],
})
export class QueueGeneratePackageModule {}
