import { Module } from '@nestjs/common';
import { PhysicalPackageService } from './physical-package.service';
import { PhysicalPackageController } from './physical-package.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [PhysicalPackageController],
	providers: [PhysicalPackageService, PrismaService],
})
export class PhysicalPackageModule {}
