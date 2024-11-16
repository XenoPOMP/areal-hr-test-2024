import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HrAction } from '@models/hr_action.model';
import { HrActionsService } from './hr_actions.service';
import { HrActionsController } from './hr_actions.controller';
import { Employee } from '@models/employee.model';
import { Department } from '@models/department.model';
import { Position } from '@models/position.model';

@Module({
  imports: [
    SequelizeModule.forFeature([HrAction, Employee, Department, Position]),
  ],
  controllers: [HrActionsController],
  providers: [HrActionsService],
})
export class HrActionsModule {}
