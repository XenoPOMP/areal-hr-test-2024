import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Organisation } from '@models/organization.model';
import { Department } from '@models/department.model';
import { Position } from '@models/position.model';
import { Employee } from '@models/employee.model';
import { File } from '@models/file.model';
import { HrAction } from '@models/hr_action.model';
import { HistoryOfChanges } from '@models/history_of_change.model';
import { Passport } from '@models/passport.model';
import { Address } from '@models/address.model';
import { User } from '@models/user.model';

config({ path: resolve(__dirname, '../../../.env') });

export const SequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.PGHOST || 'db',
  port: parseInt(process.env.PGPORT || '5432', 10),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  models: [
    Organisation,
    Department,
    Position,
    Employee,
    File,
    HrAction,
    HistoryOfChanges,
    Passport,
    Address,
    User,
  ],
  synchronize: false,
  logging: console.log,
};
