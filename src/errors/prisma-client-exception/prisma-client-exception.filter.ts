import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    console.error('My exception filter ' + exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002':
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      case 'P2025':
        const status2 = HttpStatus.NOT_FOUND;
        response.status(status2).json({
          statusCode: status2,
          message: message,
        });
        break;
      default:
        response.status(500).json({
          statusCode: 500,
          message,
          error: 'Internal Server Error',
        });
    }
  }
}
