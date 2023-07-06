import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondominiumModule } from './modules/condominium/condominium.module';
import { DepartmentModule } from './modules/department/department.module';
import { LayoutsNotificationModule } from './modules/layouts-notification/layouts-notification.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';
import { PersonModule } from './modules/person/person.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { MenuModule } from './modules/public/menu/menu.module';
import { PermissionsModule } from './modules/public/permissions/permissions.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { UserModule } from './modules/user/user.module';
import { HandlebarsService } from './shared/services/handlebars.service';
import { LayoutConstsService } from './shared/services/layout-consts.service';
import { PdfService } from './shared/services/pdf.service';

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
		DepartmentModule,
		OcupationsModule,
		LayoutsNotificationModule,
	],
	controllers: [AppController],
	providers: [AppService, LayoutConstsService, HandlebarsService, PdfService],
})
export class AppModule {}
