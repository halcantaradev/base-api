import { Module } from '@nestjs/common';
import { ExternalJwtModule } from 'src/shared/services/external-jwt/external-jwt.module';
import { PrismaService } from 'src/shared/services/prisma.service';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { FilaService } from 'src/shared/services/fila.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	controllers: [IntegrationController],
	imports: [ExternalJwtModule, HttpModule],
	providers: [IntegrationService, PrismaService, FilaService],
})
export class IntegrationModule {}
