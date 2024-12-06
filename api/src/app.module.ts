import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganizationsModule } from 'modules/organizations/organizations.module';
import { DepartmentsModule } from 'modules/departments/departments.module';
import { PositionsModule } from 'modules/positions/positions.module';
import { EmployeesModule } from 'modules/employees/employees.module';
import { FilesModule } from 'modules/files/files.module';
import { HrActionsModule } from 'modules/hr_actions/hr_actions.module';
import { HistoryOfChangesModule } from 'modules/history_of_changes/history_of_changes.module';
import { PassportsModule } from 'modules/passports/passports.module';
import { AddressesModule } from 'modules/addresses/addresses.module';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { SequelizeConfig } from 'config/sequelize.config';
import * as path from 'path';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { AuthController } from 'auth/auth.controller';
import { LocalStrategy } from 'auth/local.strategy';

@Module({
  imports: [
    SequelizeModule.forRoot(SequelizeConfig),
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    FilesModule,
    HrActionsModule,
    HistoryOfChangesModule,
    PassportsModule,
    AddressesModule,
    AuthModule,
    UserModule,
    PassportModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AppModule {}
