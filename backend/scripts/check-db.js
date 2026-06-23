const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'spa_crm_mis',
    charset: 'utf8mb4'
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.query('SELECT DATABASE() AS database_name, VERSION() AS mysql_version');
    const [tables] = await connection.query(
      `SELECT COUNT(*) AS table_count
       FROM information_schema.tables
       WHERE table_schema = ?`,
      [config.database]
    );

    console.log(`Connected to ${rows[0].database_name} on ${config.host}:${config.port}`);
    console.log(`MySQL version: ${rows[0].mysql_version}`);
    console.log(`Tables: ${tables[0].table_count}`);
  } catch (error) {
    console.error('Database check failed.');
    console.error(`Host: ${config.host}:${config.port}`);
    console.error(`Database: ${config.database}`);
    console.error(`User: ${config.user}`);
    console.error(`Error: ${error.code || error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error('MySQL is not running or is not listening on this host/port.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Run: npm run db:import');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Username/password is incorrect. Update backend/.env.');
    }

    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

main();
