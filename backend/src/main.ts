import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http/http-exception.filter';
import { SuccessResponseInterceptor } from './common/http/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const line = `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`;
      if (res.statusCode >= 400) {
        console.log(`\x1b[31m${line}\x1b[0m`);
        return;
      }
      console.log(line);
    });
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
    credentials: true,
  });

  //make version apis
  app.setGlobalPrefix('api');
  app.enableVersioning({type: VersioningType.URI, defaultVersion: '1' });

  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Voz Clone API')
    .setDescription('Backend forum API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
