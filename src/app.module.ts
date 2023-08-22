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
import { SetupModule } from './modules/setup/setup.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { UserModule } from './modules/user/user.module';
import { LayoutConstsService } from './shared/services/layout-consts.service';
import { ExternalAccessDocumentsModule } from './modules/external-access-documents/external-access-documents.module';
import { ExternalJwtModule } from './shared/services/external-jwt/external-jwt.module';
import { SubsidiaryModule } from './modules/subsidiary/subsidiary.module';
import { ContractTypesCondominiumModule } from './modules/contract-type-condominium/contract-types-condominium.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { DocumentsModule } from './modules/documents/documents.module';

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
		SetupModule,
		ExternalAccessDocumentsModule,
		ExternalJwtModule,
		SubsidiaryModule,
		ContractTypesCondominiumModule,
		IntegrationModule,
		DocumentsModule,
	],
	controllers: [AppController],
	providers: [AppService, LayoutConstsService],
})
export class AppModule {}
