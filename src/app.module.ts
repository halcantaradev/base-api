import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UserModule } from './modules/user/user.module';
import { SetupModule } from './modules/setup/setup.module';
import { PersonModule } from './modules/person/person.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { MenuModule } from './modules/public/menu/menu.module';
import { ProtocolModule } from './modules/protocol/protocol.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';
import { DepartmentModule } from './modules/department/department.module';
import { SubsidiaryModule } from './modules/subsidiary/subsidiary.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { CondominiumModule } from './modules/condominium/condominium.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PermissionsModule } from './modules/public/permissions/permissions.module';
import { ExternalJwtModule } from './shared/services/external-jwt/external-jwt.module';
import { NotificationEventsModule } from './modules/notification-events/notification-events.module';
import { LayoutsNotificationModule } from './modules/layouts-notification/layouts-notification.module';
import { ExternalAccessDocumentsModule } from './modules/external-access-documents/external-access-documents.module';
import { ContractTypesCondominiumModule } from './modules/contract-type-condominium/contract-types-condominium.module';

import { PrismaService } from './shared/services/prisma.service';
import { LayoutConstsService } from './shared/services/layout-consts.service';

import {
	UserExists,
	DepartmentExists,
	CondominiumExists,
	DocumentTypeExists,
} from './shared/validators';
import { ImportDataModule } from './modules/import-data/import-data.module';
import { GlobalModule } from './modules/global/global.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		MenuModule,
		SetupModule,
		GlobalModule,
		PersonModule,
		ProtocolModule,
		DocumentsModule,
		UploadFileModule,
		DepartmentModule,
		OcupationsModule,
		SubsidiaryModule,
		IntegrationModule,
		ExternalJwtModule,
		CondominiumModule,
		PermissionsModule,
		NotificationModule,
		NotificationEventsModule,
		LayoutsNotificationModule,
		ExternalAccessDocumentsModule,
		ContractTypesCondominiumModule,
		ImportDataModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		UserExists,
		PrismaService,
		DepartmentExists,
		CondominiumExists,
		DocumentTypeExists,
		LayoutConstsService,
	],
})
export class AppModule {}
