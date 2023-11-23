import { Module } from '@nestjs/common';
import { PhysicalPackageService } from './physical-package.service';
import { PhysicalPackageController } from './physical-package.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';

@Module({
	controllers: [PhysicalPackageController],
	providers: [PhysicalPackageService],
	imports: [PrismaModule],
})
export class PhysicalPackageModule {}
