import { Module } from '@nestjs/common';
import { VirtualPackageService } from './virtual-package.service';
import { VirtualPackageController } from './virtual-package.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [VirtualPackageController],
	providers: [VirtualPackageService, PrismaService],
})
export class VirtualPackageModule {}
