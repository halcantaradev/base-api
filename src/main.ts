import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { useContainer } from 'class-validator';
import { PrismaExceptionFilter } from './shared/filters/prisma-exception-filter';
import { HttpExceptionFilter } from './shared/filters/http-exception-filter';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';
import { LoggerService } from './shared/services/logger.service';
import { HttpService } from '@nestjs/axios';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: { origin: ['*'] },
	});

	// Swagger Config
	if (process.env.NODE_ENV == 'development') {
		const config = new DocumentBuilder()
			.setTitle('Gestão')
			.setDescription('API para o sistema de gestão')
			.setVersion('1.0')
			.build();

		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('docs', app, document);
	}

	app.setGlobalPrefix('/api');

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalFilters(new PrismaExceptionFilter());
	app.useGlobalInterceptors(
		new LoggerInterceptor(new LoggerService(new HttpService())),
	);

	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
