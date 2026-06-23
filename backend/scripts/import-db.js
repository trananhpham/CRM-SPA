const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

function splitSqlStatements(sql) {
  const statements = [];
  let delimiter = ';';
  let buffer = '';
  let quote = null;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];
    const atLineStart = buffer.length === 0 || buffer.endsWith('\n');

    if (!quote && !inLineComment && !inBlockComment && atLineStart) {
      const rest = sql.slice(i);
      const match = rest.match(/^DELIMITER\s+(\S+)\s*(?:\r?\n|$)/i);
      if (match) {
        delimiter = match[1];
        i += match[0].length - 1;
        continue;
      }
    }

    if (!quote && !inBlockComment && char === '-' && next === '-') {
      inLineComment = true;
    } else if (!quote && !inLineComment && char === '/' && next === '*') {
      inBlockComment = true;
    } else if (inLineComment && (char === '\n' || char === '\r')) {
      inLineComment = false;
    } else if (inBlockComment && char === '*' && next === '/') {
      inBlockComment = false;
      buffer += char + next;
      i += 1;
      continue;
    } else if (!inLineComment && !inBlockComment && (char === "'" || char === '"' || char === '`')) {
      if (quote === char) {
        quote = null;
      } else if (!quote) {
        quote = char;
      }
    }

    buffer += char;

    if (!quote && !inLineComment && !inBlockComment && buffer.endsWith(delimiter)) {
      const statement = buffer.slice(0, -delimiter.length).trim();
      if (statement) statements.push(statement);
      buffer = '';
    }
  }

  const tail = buffer.trim();
  if (tail) statements.push(tail);
  return statements;
}

async function main() {
  const sqlPath = path.resolve(__dirname, '..', '..', 'spa_crm_mis_mysql.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = splitSqlStatements(sql);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4',
    multipleStatements: false
  });

  try {
    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log(`Imported ${statements.length} SQL statements from ${sqlPath}`);
    console.log(`Database ready: ${process.env.DB_NAME || 'spa_crm_mis'}`);
  } catch (error) {
    console.error('Database import failed.');
    console.error(`Error: ${error.code || error.message}`);
    console.error(error.sqlMessage || error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Database import failed.');
  console.error(`Error: ${error.code || error.message}`);
  if (error.code === 'ECONNREFUSED') {
    console.error('MySQL is not running or is not listening on the configured host/port.');
  }
  process.exit(1);
});
