import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Position } from '@models/position.model';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Module({
  imports: [SequelizeModule.forFeature([Position, HistoryOfChanges])],
  providers: [PositionsService, HistoryOfChangesService],
  controllers: [PositionsController],
  exports: [PositionsService],
})
export class PositionsModule {}
