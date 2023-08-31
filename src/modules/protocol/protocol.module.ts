import { Module } from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { PersonModule } from '../person/person.module';
import { ProtocolController } from './protocol.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	imports: [PersonModule],
	controllers: [ProtocolController],
	providers: [ProtocolService, PrismaService],
})
export class ProtocolModule {}
