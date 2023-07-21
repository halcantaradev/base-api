import { Module } from '@nestjs/common';
import { ExternalJwtService } from './external-jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.EXTERNAL_ACCESS_SECRET,
			signOptions: { expiresIn: '1d' },
		}),
	],
	providers: [ExternalJwtService],
	exports: [ExternalJwtService],
})
export class ExternalJwtModule {}
