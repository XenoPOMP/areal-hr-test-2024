// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST || 'db',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST || 'db',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST || 'db',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
  },
};
