const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kurir_db'
});

console.log('Database terkoneksi');

module.exports = db;
