import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { CargoRepository } from './cargo.repository';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  controllers: [CargoController],
  providers: [CargoService, CargoRepository, PrismaService],
  exports: [CargoRepository],
})
export class CargoModule {}
