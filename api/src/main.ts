import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:9000',
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // это будет URL для доступа к изображениям
  });

  await app.listen(3000);
}
bootstrap();
