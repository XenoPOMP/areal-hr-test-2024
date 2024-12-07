import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller'; // Путь к контроллеру
import { UserService } from 'src/modules/user/user.service'; // Путь к сервису
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model'; // Путь к модели

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Экспортируем для использования в других модулях
})
export class UserModule {}
