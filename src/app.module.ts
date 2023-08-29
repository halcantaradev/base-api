import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { SetupModule } from './modules/setup/setup.module';
import { PersonModule } from './modules/person/person.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { MenuModule } from './modules/public/menu/menu.module';
import { ProtocolModule } from './modules/protocol/protocol.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';
import { DepartmentModule } from './modules/department/department.module';
import { SubsidiaryModule } from './modules/subsidiary/subsidiary.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { CondominiumModule } from './modules/condominium/condominium.module';
import { LayoutConstsService } from './shared/services/layout-consts.service';
import { NotificationModule } from './modules/notification/notification.module';
import { PermissionsModule } from './modules/public/permissions/permissions.module';
import { ExternalJwtModule } from './shared/services/external-jwt/external-jwt.module';
import { LayoutsNotificationModule } from './modules/layouts-notification/layouts-notification.module';
import { ExternalAccessDocumentsModule } from './modules/external-access-documents/external-access-documents.module';
import { ContractTypesCondominiumModule } from './modules/contract-type-condominium/contract-types-condominium.module';
import {
	CondominiumExists,
	DepartmentExists,
	DocumentTypeExists,
	UserExists,
} from './shared/validators';
import { PrismaService } from './shared/services/prisma.service';
import { DocumentsModule } from './modules/documents/documents.module';
import { FilaModule } from './shared/services/fila/fila.module';

@Module({
	imports: [
		FilaModule,
		AuthModule,
		UserModule,
		MenuModule,
		SetupModule,
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
		LayoutsNotificationModule,
		ExternalAccessDocumentsModule,
		ContractTypesCondominiumModule,
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
