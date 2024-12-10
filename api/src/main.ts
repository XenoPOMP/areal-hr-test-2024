import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:9000', // Точно указываем URL фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Включаем учетные данные
  });

  // Настройка сессий
  app.use(
    session({
      secret:
        'c8f23775e445ce1fb719237a4a13ea6bbe3ebefe3eed54c3b6b03130197329f3',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Установите false для разработки
        httpOnly: true,
        sameSite: 'lax', // Для работы в cross-origin
      },
    }),
  );

  // Добавление статической раздачи файлов
  const filePath = path.join('E:/areal-hr-test-2024/files');
  app.useStaticAssets(filePath, { prefix: '/files' });

  // Включение глобальных пайпов для валидации
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
