const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'bqshb8byxbqrzvi5vwpo-mysql.services.clever-cloud.com',
  user: process.env.DB_USER || 'uycx3qgiuvbtw151',
  password: process.env.DB_PASSWORD || 'mLd68rekKMwKP86OQIzO',
  database: process.env.DB_NAME || 'bqshb8byxbqrzvi5vwpo',
  waitForConnections: true,
  connectionLimit: 5, // 🔴 NO MÁS DE 5
  queueLimit: 10
});

module.exports = pool;
