import { NestFactory } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(DashboardModule);

  // Enable CORS for your frontend (or all origins)
   app.enableCors({
    origin: ['http://localhost:3000'], // explicitly allow your frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // if you plan to send cookies or auth headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4040 );
}
bootstrap();
