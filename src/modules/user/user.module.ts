import { Module } from '@nestjs/common';
import { PersonModule } from '../person/person.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
	EmailNotExists,
	OcupationExists,
	UsernameNotExists,
} from './validators';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';

@Module({
	imports: [PersonModule, PrismaModule],
	controllers: [UserController],
	providers: [
		UserService,
		UsernameNotExists,
		EmailNotExists,
		OcupationExists,
	],
	exports: [UserService],
})
export class UserModule {}
