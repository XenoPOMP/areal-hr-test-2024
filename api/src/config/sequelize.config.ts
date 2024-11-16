import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Organisation } from '@models/organization.model';
import { Department } from '@models/department.model';
import { Position } from '@models/position.model';
import { Employee } from '@models/employee.model';
import { File } from '@models/file.model';
import { HrAction } from '@models/hr_action.model';
import { HistoryOfChange } from '@models/history_of_change.model';
import { Passport } from '@models/passport.model';
import { Address } from '@models/address.model';
import { User } from '@models/user.model';

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
