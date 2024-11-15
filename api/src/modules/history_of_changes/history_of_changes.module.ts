import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'; // Импортируем SequelizeModule
import { HistoryOfChangesController } from './history_of_changes.controller';
import { HistoryOfChangesService } from './history_of_changes.service';
import { HistoryOfChange } from './history_of_change.model'; // Импортируем модель

@Module({
  imports: [SequelizeModule.forFeature([HistoryOfChange])], // Используем SequelizeModule
  controllers: [HistoryOfChangesController],
  providers: [HistoryOfChangesService],
})
export class HistoryOfChangesModule {}
