import { Module } from '@nestjs/common';
import { OcupationsService } from './ocupations.service';
import { OcupationsController } from './ocupations.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [OcupationsController],
	providers: [OcupationsService, PrismaService],
})
export class OcupationsModule {}
