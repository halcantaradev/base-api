import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/user.module';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LoggerService } from 'src/shared/services/logger.service';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET,
			signOptions: { expiresIn: '1d', algorithm: 'HS512' },
		}),
		UserModule,
		FilaModule,
		PrismaModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		LoggerService,
		HandlebarsService,
	],
})
export class AuthModule {}
