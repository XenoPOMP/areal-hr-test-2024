import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HistoryOfChangesController } from './history_of_changes.controller';
import { HistoryOfChangesService } from './history_of_changes.service';
import { HistoryOfChange } from '@models/history_of_change.model';

@Module({
  imports: [SequelizeModule.forFeature([HistoryOfChange])],
  controllers: [HistoryOfChangesController],
  providers: [HistoryOfChangesService],
})
export class HistoryOfChangesModule {}
