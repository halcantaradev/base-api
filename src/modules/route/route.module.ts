import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
	controllers: [RouteController],
	providers: [RouteService],
	imports: [PrismaModule],
})
export class RouteModule {}
