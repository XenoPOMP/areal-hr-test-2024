import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './employee.model';
import { Position } from '../positions/position.model';

@Module({
  imports: [SequelizeModule.forFeature([Employee, Position])],
  providers: [EmployeesService],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
