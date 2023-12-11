import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: process.env['FRONTEND_BASEURL'], credentials: true },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/api/public',
    index: false,
  });
  app.setGlobalPrefix('api');
  const url = new URL(process.env['BACKEND_BASEURL']);

  const config = new DocumentBuilder()
    .setTitle('Ping Pong')
    .setDescription('The pingpong API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000, url.hostname);
}

bootstrap();
