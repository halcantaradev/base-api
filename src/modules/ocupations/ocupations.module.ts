import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { OcupationsController } from './ocupations.controller';
import { OcupationsService } from './ocupations.service';

@Module({
	controllers: [OcupationsController],
	providers: [OcupationsService],
	imports: [PrismaModule],
})
export class OcupationsModule {}
