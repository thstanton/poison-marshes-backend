import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './errors/prisma-client-exception/prisma-client-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigin =
    process.env.NODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN;

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  await app.listen(3000);
}
bootstrap();
