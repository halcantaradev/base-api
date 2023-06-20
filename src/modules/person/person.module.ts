import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [PersonController],
	providers: [PersonService, PrismaService],
	exports: [PersonService],
})
export class PersonModule {}
