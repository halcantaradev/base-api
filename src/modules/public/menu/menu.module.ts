import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
	controllers: [MenuController],
	providers: [MenuService],
	imports: [PrismaModule],
})
export class MenuModule {}
