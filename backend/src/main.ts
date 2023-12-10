import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: process.env['FRONTEND_BASEURL'], credentials: true },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/public',
    index: false,
  });
  const url = new URL(process.env['BACKEND_BASEURL']);
  await app.listen(url.port, url.hostname);
}

bootstrap();
