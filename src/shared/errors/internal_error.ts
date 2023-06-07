import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class InternalErrorException extends HttpException {
  constructor(err: string | HttpException | PrismaClientKnownRequestError) {
    let message = '';

    if (err instanceof HttpException) throw err;

    if (err instanceof PrismaClientKnownRequestError)
      message = `Ocorreu um erro ao acessar o banco de dados: ${err.code}`;
    else message = err || `Ocorreu um erro interno`;

    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
