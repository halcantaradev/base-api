import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupController } from './setup.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [SetupController],
	providers: [SetupService, PrismaService],
})
export class SetupModule {}
