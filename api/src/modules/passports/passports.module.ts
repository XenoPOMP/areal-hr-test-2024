import { Module } from '@nestjs/common';
import { Passport } from './passport.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportsService } from './passports.service';
import { PassportsController } from './passports.controller';

@Module({
  imports: [SequelizeModule.forFeature([Passport])],
  providers: [PassportsService], // Подключаем сервис
  controllers: [PassportsController], // Подключаем контроллер
})
export class PassportsModule {}
