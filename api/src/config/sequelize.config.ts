// src/config/sequelize.config.ts
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Organisation } from '../modules/organizations/organization.model';
import { Department } from '../modules/departments/department.model';
import { Position } from '../modules/positions/position.model';
import { Employee } from '../modules/employees/employee.model';
import { File } from '../modules/files/file.model';
import { HrAction } from '../modules/hr_actions/hr_action.model';
import { HistoryOfChange } from '../modules/history_of_changes/history_of_change.model';
import { Passport } from '../modules/passports/passport.model';
import { Address } from '../modules/addresses/address.model';
import { User } from '../modules/users/user.model';

export const SequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Spiridon_2017',
  database: 'areal_hr',
  models: [
    Organisation,
    Department,
    Position,
    Employee,
    File,
    HrAction,
    HistoryOfChange,
    Passport,
    Address,
    User,
  ],
  synchronize: false,
  logging: console.log,
};
