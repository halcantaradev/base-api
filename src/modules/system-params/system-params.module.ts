import { Module } from '@nestjs/common';
import { SystemParamsService } from './system-params.service';
import { SystemParamsController } from './system-params.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [SystemParamsController],
	providers: [SystemParamsService],
})
export class SystemParamsModule {}
