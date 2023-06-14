import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: `Ocorreu um erro ao interno`,
			code: exception.code,
		});
	}
}
