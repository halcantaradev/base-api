import { Module } from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { ProtocolController } from './protocol.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [ProtocolController],
	providers: [ProtocolService, PrismaService],
})
export class ProtocolModule {}
