import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Global()
@Module({
	controllers: [PermissionsController],
	providers: [PermissionsService],
	exports: [PermissionsService],
	imports: [PrismaModule],
})
export class PermissionsModule {}
