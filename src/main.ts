import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './errors/prisma-client-exception/prisma-client-exception.filter';
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  let corsOptions: CorsOptions = {};
  if (process.env.NODE_ENV === 'development') {
    const allowedOrigins = [/\.vercel\.app$/];

    corsOptions = {
      origin: function (origin, callback) {
        if (allowedOrigins.some((pattern) => pattern.test(origin))) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    };
  } else {
    corsOptions = {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    };
  }

  app.enableCors(corsOptions);

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  await app.listen(3000);
}
bootstrap();
