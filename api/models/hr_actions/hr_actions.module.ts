import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HrAction } from './hr_action.model';
import { HrActionsService } from './hr_actions.service';
import { HrActionsController } from './hr_actions.controller';
import { Employee } from '../employees/employee.model'; // Импорт модели сотрудника
import { Department } from '../departments/department.model'; // Импорт модели департамента
import { Position } from '../positions/position.model'; // Импорт модели позиции

@Module({
  imports: [
    SequelizeModule.forFeature([HrAction, Employee, Department, Position]),
  ],
  controllers: [HrActionsController],
  providers: [HrActionsService],
})
export class HrActionsModule {}
