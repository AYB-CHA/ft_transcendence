import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env['FRONTEND_BASEURL'] },
  });
  app.useGlobalPipes(new ValidationPipe());
  const url = new URL(process.env['BACKEND_BASEURL']);
  await app.listen(url.port, url.hostname);
}

bootstrap();
