import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { PrismaService } from 'src/shared/services/prisma.service';
import { PermissionsModule } from '../public/permissions/permissions.module';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

@Module({
	controllers: [IntegrationController],
	imports: [ExternalJwtModule, HttpModule, FilaModule, PermissionsModule],
	providers: [IntegrationService, PrismaService],
})
export class IntegrationModule {}
