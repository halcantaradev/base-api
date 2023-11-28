import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
	controllers: [PersonController],
	providers: [PersonService],
	imports: [PrismaModule],
	exports: [PersonService],
})
export class PersonModule {}
