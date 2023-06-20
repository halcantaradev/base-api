import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';

@Module({
	imports: [AuthModule, UserModule, PermissionsModule, NotificationModule, OcupationsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
