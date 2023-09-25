import { Module } from '@nestjs/common';
import { PhysicalPackageService } from './physical-package.service';
import { PhysicalPackageController } from './physical-package.controller';

@Module({
  controllers: [PhysicalPackageController],
  providers: [PhysicalPackageService]
})
export class PhysicalPackageModule {}
