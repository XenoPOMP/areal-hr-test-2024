import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryOfChangesController } from './history_of_changes.controller';
import { HistoryOfChangesService } from './history_of_changes.service';
import { HistoryOfChanges } from './history_of_change.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryOfChanges])],
  controllers: [HistoryOfChangesController],
  providers: [HistoryOfChangesService],
})
export class HistoryOfChangesModule {}
