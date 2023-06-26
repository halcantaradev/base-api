import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/public/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PermissionsModule } from './modules/public/permissions/permissions.module';
import { NotificationModule } from './modules/notification/notification.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { CondominiumModule } from './modules/condominium/condominium.module';
import { PersonModule } from './modules/person/person.module';
import { MenuModule } from './modules/public/menu/menu.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		PermissionsModule,
		NotificationModule,
		UploadFileModule,
		CondominiumModule,
		PersonModule,
		MenuModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
