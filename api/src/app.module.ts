import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { FilesModule } from './modules/files/files.module';
import { HRActionsModule } from './modules/hr_actions/hr_actions.module';
import { HistoryOfChangesModule } from './modules/history_of_changes/history_of_changes.module';
import { PassportsModule } from './modules/passports/passports.module';
import { AddressesModule } from './modules/addresses/addresses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Spiridon_2017',
      database: 'areal_hr',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*.js'],
      synchronize: false,
    }),
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    FilesModule,
    HRActionsModule,
    HistoryOfChangesModule,
    PassportsModule,
    AddressesModule,
  ],
})
export class AppModule {}
