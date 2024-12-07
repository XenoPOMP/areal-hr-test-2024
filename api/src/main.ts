import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:9000', // Разрешаем только origin фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization', // Разрешаем эти заголовки
    credentials: true, // Разрешаем передачу cookies
  });

  app.use(
    session({
      secret:
        'c8f23775e445ce1fb719237a4a13ea6bbe3ebefe3eed54c3b6b03130197329f3',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, sameSite: 'lax' }, // cookie для сессии
    }),
  );

  // Включение глобальных пайпов для валидации
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
