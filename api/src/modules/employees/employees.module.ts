import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from '@models/employee.model';
import { Position } from '@models/position.model';
import { Address } from 'models/address.model';
import { Passport } from 'models/passport.model';
import { File } from '@models/file.model';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { HistoryOfChangesService } from 'modules/history_of_changes/history_of_changes.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Employee,
      Position,
      Address,
      Passport,
      HistoryOfChanges,
      File,
    ]),
  ],
  providers: [EmployeesService, HistoryOfChangesService],
  controllers: [EmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
