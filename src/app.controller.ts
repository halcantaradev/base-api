import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Service Status')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiOperation({ summary: 'Retorna algo para informar o status da API' })
	@ApiResponse({
		description: 'Status retornado com sucesso',
		status: HttpStatus.OK,
		type: String,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao retornar o status',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	})
	getStatus(): string {
		return this.appService.getStatus();
	}
}
