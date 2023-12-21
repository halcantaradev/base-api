import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CondominiumModule } from './modules/condominium/condominium.module';
import { ContractTypesCondominiumModule } from './modules/contract-type-condominium/contract-types-condominium.module';
import { DepartmentModule } from './modules/department/department.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ExternalAccessDocumentsModule } from './modules/external-access-documents/external-access-documents.module';
import { GlobalModule } from './modules/global/global.module';
import { HistoryModule } from './modules/history/history.module';
import { ImportDataModule } from './modules/import-data/import-data.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { LayoutsNotificationModule } from './modules/layouts-notification/layouts-notification.module';
import { NotificationEventsModule } from './modules/notification-events/notification-events.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';
import { PersonModule } from './modules/person/person.module';
import { PhysicalPackageModule } from './modules/physical-package/physical-package.module';
import { ProtocolModule } from './modules/protocol/protocol.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { MenuModule } from './modules/public/menu/menu.module';
import { PermissionsModule } from './modules/public/permissions/permissions.module';
import { QueueGeneratePackageModule } from './modules/queue-generate-package/queue-generate-package.module';
import { RouteModule } from './modules/route/route.module';
import { SetupModule } from './modules/setup/setup.module';
import { SubsidiaryModule } from './modules/subsidiary/subsidiary.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { UserModule } from './modules/user/user.module';
import { VirtualPackageModule } from './modules/virtual-package/virtual-package.module';
import { ExternalJwtModule } from './shared/services/external-jwt/external-jwt.module';

import { LayoutConstsService } from './shared/services/layout-consts.service';

import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyStatisticsModule } from './modules/public/company-statistics/company-statistics.module';
import { SystemParamsModule } from './modules/system-params/system-params.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';
import { RocketModule } from './shared/services/rocket/rocket.module';
import { TasksModule } from './shared/services/tasks/tasks.module';
import {
	CondominiumExists,
	DepartmentExists,
	DocumentTypeExists,
	UserExists,
} from './shared/validators';

@Module({
	imports: [
		AuthModule,
		UserModule,
		MenuModule,
		SetupModule,
		RouteModule,
		GlobalModule,
		PersonModule,
		HistoryModule,
		ProtocolModule,
		DocumentsModule,
		UploadFileModule,
		DepartmentModule,
		OcupationsModule,
		SubsidiaryModule,
		ImportDataModule,
		IntegrationModule,
		ExternalJwtModule,
		CondominiumModule,
		PermissionsModule,
		NotificationModule,
		VirtualPackageModule,
		PhysicalPackageModule,
		NotificationEventsModule,
		LayoutsNotificationModule,
		QueueGeneratePackageModule,
		ExternalAccessDocumentsModule,
		ContractTypesCondominiumModule,
		PrismaModule,
		ScheduleModule.forRoot(),
		TasksModule,
		RocketModule,
		HttpModule,
		SystemParamsModule,
		CompanyStatisticsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		UserExists,
		DepartmentExists,
		CondominiumExists,
		DocumentTypeExists,
		LayoutConstsService,
	],
})
export class AppModule {}
