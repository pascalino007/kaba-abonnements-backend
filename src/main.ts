import { NestFactory } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(DashboardModule);

  // Enable CORS for your frontend (or all origins)
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4040);
}
bootstrap();