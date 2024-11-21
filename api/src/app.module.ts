import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'; // Изменено
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { DepartmentsModule } from 'modules/departments/departments.module';
import { PositionsModule } from 'modules/positions/positions.module';
import { EmployeesModule } from 'modules/employees/employees.module';
import { FilesModule } from 'modules/files/files.module';
import { HrActionsModule } from 'modules/hr_actions/hr_actions.module';
import { HistoryOfChangesModule } from 'modules/history_of_changes/history_of_changes.module';
import { PassportsModule } from 'modules/passports/passports.module';
import { AddressesModule } from 'modules/addresses/addresses.module';
import { SequelizeConfig } from 'config/sequelize.config';
@Module({
  imports: [
    SequelizeModule.forRoot(SequelizeConfig), // Подключаем Sequelize
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    FilesModule,
    HrActionsModule,
    HistoryOfChangesModule,
    PassportsModule,
    AddressesModule,
  ],
})
export class AppModule {}
