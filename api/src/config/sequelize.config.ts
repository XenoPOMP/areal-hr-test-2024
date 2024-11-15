// src/config/sequelize.config.ts
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const SequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Spiridon_2017',
  database: 'areal_hr',
  models: [__dirname + '/../modules/**/*.model.ts'], // Путь к моделям
  synchronize: true, // Внимание: автоматически синхронизирует с базой данных
  logging: true,
};
