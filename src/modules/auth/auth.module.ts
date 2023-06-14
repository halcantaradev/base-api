import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: { expiresIn: '1d' },
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		UserService,
		PrismaService,
		JwtStrategy,
	],
})
export class AuthModule {}
