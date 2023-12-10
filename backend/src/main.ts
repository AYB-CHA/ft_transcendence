import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env['FRONTEND_BASEURL'], credentials: true },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const url = new URL(process.env['BACKEND_BASEURL']);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000, url.hostname);
}

bootstrap();
