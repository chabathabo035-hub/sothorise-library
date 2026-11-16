// Run once: npm run setup  -> creates the database and the 3 tables from schema.sql
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await conn.query(sql);
    // Makes older databases accept the RETURN type too (safe to run many times)
    await conn.query("ALTER TABLE transactions MODIFY type ENUM('ADD_STOCK','BORROW','RETURN') NOT NULL");
    console.log('Database and tables created');
    await conn.end();
  } catch (e) {
    console.error('Setup failed:', e.message);
    console.error('Check: is MySQL started in XAMPP? Is DB_PASSWORD in .env correct?');
    process.exit(1);
  }
})();
