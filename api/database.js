require('dotenv').config();
console.log('Database password:', typeof process.env.PGPASSWORD);

module.exports = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
};
