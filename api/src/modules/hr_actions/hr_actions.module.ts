import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HrAction } from '@models/hr_action.model';
import { HrActionsService } from './hr_actions.service';
import { HrActionsController } from './hr_actions.controller';
import { Employee } from '@models/employee.model';
import { Department } from '@models/department.model';
import { Position } from '@models/position.model';
import { EmployeesModule } from 'modules/employees/employees.module';
import { DepartmentsModule } from 'modules/departments/departments.module';
import { PositionsModule } from 'modules/positions/positions.module';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HrAction,
      Employee,
      Department,
      Position,
      HistoryOfChanges,
    ]),
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
  ],
  controllers: [HrActionsController],
  providers: [HrActionsService, HistoryOfChangesService],
})
export class HrActionsModule {}
