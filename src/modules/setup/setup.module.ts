import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
	controllers: [SetupController],
	providers: [SetupService],
	imports: [PrismaModule],
})
export class SetupModule {}
