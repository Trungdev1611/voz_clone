import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http/http-exception.filter';
import { SuccessResponseInterceptor } from './common/http/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
