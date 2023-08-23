import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
} from '@nestjs/common';
import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
	PrismaClientUnknownRequestError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		console.log(exception);

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: `Ocorreu um erro interno`,
		});
	}
}
