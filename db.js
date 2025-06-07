const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Bintang',   // ganti dengan nama DB kamu
  password: 'firbin00',   // ganti dengan passwordmu
  port: 5432,
});

module.exports = pool;
