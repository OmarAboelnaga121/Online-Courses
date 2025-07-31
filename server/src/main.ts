import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  // Create app with raw body access for webhooks
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Online Course (EduFlex)')
    .setDescription('The Documentation of Online Courses Website')
    .setVersion('1.0')
    .addBearerAuth()
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Auth', 'Authentication and user management')
    .addTag('Courses', 'Course management')
    .addTag('Users', 'User management')
    .addTag('Payments', 'Payment management')
    .addServer('http://localhost:3000', 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Security and optimization middleware
  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
