import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaService } from 'src/shared/services/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { LoggerService } from 'src/shared/services/logger.service';
@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: { expiresIn: '1d', algorithm: 'HS512' },
		}),
		UserModule,
		FilaModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		PrismaService,
		JwtStrategy,
		LoggerService,
	],
})
export class AuthModule {}
