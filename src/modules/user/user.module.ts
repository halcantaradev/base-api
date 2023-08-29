import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
	UsernameNotExists,
	EmailNotExists,
	OcupationExists,
} from './validators';
import { PersonModule } from '../person/person.module';

@Module({
	imports: [PersonModule],
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		UsernameNotExists,
		EmailNotExists,
		OcupationExists,
	],
	exports: [UserService],
})
export class UserModule {}
