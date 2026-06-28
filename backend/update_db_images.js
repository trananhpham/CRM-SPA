const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDb() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'spa_crm'
    });

    console.log('Connected to the database. Checking for image_url columns...');

    // Add image_url to services if not exists
    try {
      await connection.query('ALTER TABLE services ADD COLUMN image_url VARCHAR(255)');
      console.log('Added image_url column to services table.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('image_url column already exists in services.');
      } else {
        console.error('Error adding image_url to services:', e.message);
      }
    }

    // Add image_url to packages if not exists
    try {
      await connection.query('ALTER TABLE packages ADD COLUMN image_url VARCHAR(255)');
      console.log('Added image_url column to packages table.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('image_url column already exists in packages.');
      } else {
        console.error('Error adding image_url to packages:', e.message);
      }
    }

    // Update existing services
    const servicesData = [
      { id: 1, url: '/images/facial_spa.png' },
      { id: 2, url: '/images/massage_spa.png' },
      { id: 3, url: '/images/laser_spa.png' }
    ];
    for (let s of servicesData) {
      await connection.query('UPDATE services SET image_url = ? WHERE service_id = ?', [s.url, s.id]);
    }
    
    // Insert new services
    const newServices = [
      { name: 'Tẩy Tế Bào Chết Toàn Thân', catId: 2, price: 350000, duration: 45, desc: 'Loại bỏ tế bào chết, làm mịn màng và sáng da', url: '/images/body_scrub.png' },
      { name: 'Trị Mụn Chuyên Sâu', catId: 1, price: 650000, duration: 75, desc: 'Lấy nhân mụn chuẩn y khoa, chiếu ánh sáng sinh học', url: '/images/acne_treatment.png' }
    ];
    for (let s of newServices) {
      try {
        await connection.query(
          'INSERT INTO services (service_name, category_id, price, duration_minutes, description, status, image_url) VALUES (?, ?, ?, ?, ?, "ACTIVE", ?)',
          [s.name, s.catId, s.price, s.duration, s.desc, s.url]
        );
      } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
           await connection.query('UPDATE services SET image_url = ? WHERE service_name = ?', [s.url, s.name]);
        }
      }
    }

    // Update existing packages
    const packagesData = [
      { id: 1, url: '/images/combo_youth.png' },
      { id: 2, url: '/images/vip_relax.png' }
    ];
    for (let p of packagesData) {
      await connection.query('UPDATE packages SET image_url = ? WHERE package_id = ?', [p.url, p.id]);
    }

    // Insert new package
    try {
      const [result] = await connection.query(
        'INSERT INTO packages (package_name, package_price, validity_days, description, status, image_url) VALUES (?, ?, ?, ?, "ACTIVE", ?)',
        ['Liệu Trình Trị Mụn Tận Gốc', 2800000, 90, 'Giải quyết triệt để vấn đề mụn, mờ thâm', '/images/acne_course.png']
      );
      // add package_items
      await connection.query('INSERT INTO package_items (package_id, service_id, included_sessions) VALUES (?, ?, ?)', [result.insertId, 5, 5]); // service 5 = tri mun
    } catch (e) {
       if (e.code === 'ER_DUP_ENTRY') {
         await connection.query('UPDATE packages SET image_url = ? WHERE package_name = ?', ['/images/acne_course.png', 'Liệu Trình Trị Mụn Tận Gốc']);
       }
    }

    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Failed to update database:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

updateDb();
