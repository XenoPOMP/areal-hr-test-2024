import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:9000',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.use(
    session({
      secret:
        process.env.SESSION_SECRET ||
        'c8f23775e445ce1fb719237a4a13ea6bbe3ebefe3eed54c3b6b03130197329f3',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // Время действия сессии: 1 час
    }),
  );

  // Инициализация Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
