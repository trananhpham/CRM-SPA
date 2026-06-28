const sql = require('mssql');
require('dotenv').config();

const config = {
  server: 'localhost',
  database: process.env.DB_NAME || 'spa_crm_mis',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Sử dụng Windows Authentication nếu không có username
if (!process.env.DB_USER) {
  delete config.authentication;
  config.options.trustedConnection = true;
}

let poolPromise = sql.connect(config);

/**
 * Wrapper tương thích với cú pháp mysql2: db.query(sql, params)
 * Trả về [rows, fields] giống mysql2
 */
const db = {
  query: async (queryStr, params = []) => {
    const pool = await poolPromise;
    const request = pool.request();

    // Thay ? bằng @p0, @p1, ... và bind params
    let paramIndex = 0;
    const mssqlQuery = queryStr.replace(/\?/g, () => `@p${paramIndex++}`);
    params.forEach((val, i) => {
      if (val === null || val === undefined) {
        request.input(`p${i}`, sql.NVarChar, null);
      } else if (typeof val === 'number') {
        request.input(`p${i}`, Number.isInteger(val) ? sql.Int : sql.Decimal(18, 2), val);
      } else if (val instanceof Date) {
        request.input(`p${i}`, sql.DateTime, val);
      } else {
        request.input(`p${i}`, sql.NVarChar, String(val));
      }
    });

    const result = await request.query(mssqlQuery);
    // Giả lập [rows, fields] của mysql2
    const rows = result.recordset || [];

    // Giả lập insertId cho INSERT
    if (queryStr.trim().toUpperCase().startsWith('INSERT')) {
      const idResult = await pool.request().query('SELECT SCOPE_IDENTITY() AS insertId');
      const insertId = idResult.recordset[0]?.insertId || 0;
      return [{ insertId, affectedRows: result.rowsAffected[0] }];
    }

    // Giả lập affectedRows cho UPDATE/DELETE
    if (queryStr.trim().toUpperCase().startsWith('UPDATE') || 
        queryStr.trim().toUpperCase().startsWith('DELETE')) {
      return [{ affectedRows: result.rowsAffected[0] }];
    }

    return [rows, []];
  }
};

// Kiểm tra kết nối khi khởi động
poolPromise
  .then(() => console.log('✅ Kết nối SQL Server Express thành công!'))
  .catch(err => {
    console.error('❌ Lỗi kết nối SQL Server:', err.message);
    console.log('⚠️  Hệ thống sẽ dùng Fallback Data.');
  });

module.exports = db;
