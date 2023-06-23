import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [MenuController],
	providers: [MenuService, PrismaService],
})
export class MenuModule {}
