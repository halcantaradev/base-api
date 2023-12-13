import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception-filter';
import { PrismaExceptionFilter } from './shared/filters/prisma-exception-filter';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';
import { FilaService } from './shared/services/fila/fila.service';
import { LoggerService } from './shared/services/logger.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: ['http://localhost:3000', 'http://localhost:4200'],
			credentials: true,
		},
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
		new LoggerInterceptor(new LoggerService(new FilaService())),
	);

	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
