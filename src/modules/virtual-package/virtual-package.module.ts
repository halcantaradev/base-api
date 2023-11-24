import { Module } from '@nestjs/common';
import { VirtualPackageController } from './virtual-package.controller';
import { VirtualPackageService } from './virtual-package.service';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';

@Module({
	controllers: [VirtualPackageController],
	providers: [VirtualPackageService],
	imports: [PrismaModule],
})
export class VirtualPackageModule {}
