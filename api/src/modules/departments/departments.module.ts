import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from '@models/department.model';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Module({
  imports: [SequelizeModule.forFeature([Department, HistoryOfChanges])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, HistoryOfChangesService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
