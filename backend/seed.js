const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedData() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'spa_crm_mis',
            multipleStatements: true
        });

        console.log('Connected! Inserting mock data...');

        // Insert Roles
        await connection.query(`
            INSERT IGNORE INTO roles (role_id, role_name, description) VALUES 
            (1, 'ADMIN', 'Quản trị viên hệ thống'),
            (2, 'MANAGER', 'Quản lý Spa'),
            (3, 'RECEPTIONIST', 'Lễ tân'),
            (4, 'TECHNICIAN', 'Kỹ thuật viên');
        `);

        // Insert Customers
        await connection.query(`
            INSERT IGNORE INTO customers (customer_id, full_name, phone, email, gender, customer_type) VALUES 
            (1, 'Nguyễn Văn A', '0901234567', 'a@gmail.com', 'MALE', 'VIP'),
            (2, 'Trần Thị B', '0912345678', 'b@gmail.com', 'FEMALE', 'RETURNING'),
            (3, 'Lê Thị C', '0923456789', 'c@gmail.com', 'FEMALE', 'NEW'),
            (4, 'Phạm Văn D', '0934567890', 'd@gmail.com', 'MALE', 'RETURNING'),
            (5, 'Hoàng Thị E', '0945678901', 'e@gmail.com', 'FEMALE', 'VIP');
        `);

        // Insert Employees
        await connection.query(`
            INSERT IGNORE INTO employees (employee_id, full_name, phone, position, base_salary, default_commission_rate) VALUES 
            (1, 'Lý Lễ Tân', '0999000111', 'RECEPTIONIST', 7000000, 0),
            (2, 'Trương Kỹ Thuật 1', '0999000222', 'TECHNICIAN', 5000000, 10),
            (3, 'Ngô Kỹ Thuật 2', '0999000333', 'TECHNICIAN', 5000000, 10);
        `);

        // Insert Rooms
        await connection.query(`
            INSERT IGNORE INTO rooms (room_id, room_name) VALUES 
            (1, 'Phòng VIP 1'), (2, 'Phòng Massage 1'), (3, 'Phòng Facial 1');
        `);

        // Insert Service Categories
        await connection.query(`
            INSERT IGNORE INTO service_categories (category_id, category_name) VALUES 
            (1, 'Chăm sóc da mặt'), (2, 'Massage Body'), (3, 'Trị liệu công nghệ cao');
        `);

        // Insert Services
        await connection.query(`
            INSERT IGNORE INTO services (service_id, category_id, service_name, price, duration_minutes, default_commission_rate) VALUES 
            (1, 1, 'Facial cơ bản', 300000, 60, 10),
            (2, 1, 'Trị mụn chuyên sâu', 500000, 90, 15),
            (3, 2, 'Massage thư giãn 60p', 400000, 60, 10),
            (4, 3, 'Laser trẻ hóa', 1500000, 45, 20);
        `);

        // Insert Packages
        await connection.query(`
            INSERT IGNORE INTO packages (package_id, package_name, package_price, validity_days) VALUES 
            (1, 'Gói Facial 10 Buổi', 2500000, 180),
            (2, 'Gói Triệt lông 5 Buổi', 3000000, 365);
        `);

        // Insert Package Items
        await connection.query(`
            INSERT IGNORE INTO package_items (package_item_id, package_id, service_id, included_sessions, revenue_per_session) VALUES 
            (1, 1, 1, 10, 250000),
            (2, 2, 4, 5, 600000);
        `);

        // Insert Customer Packages
        await connection.query(`
            INSERT IGNORE INTO customer_packages (customer_package_id, customer_id, package_id, purchase_date, expiry_date, purchase_amount, paid_amount, status) VALUES 
            (1, 1, 1, '2026-06-01', '2026-12-01', 2500000, 2500000, 'ACTIVE'),
            (2, 2, 2, '2026-06-15', '2027-06-15', 3000000, 1500000, 'ACTIVE');
        `);

        // Insert Customer Package Items
        await connection.query(`
            INSERT IGNORE INTO customer_package_items (customer_package_item_id, customer_package_id, service_id, total_sessions, used_sessions, revenue_per_session) VALUES 
            (1, 1, 1, 10, 3, 250000),
            (2, 2, 4, 5, 1, 600000);
        `);

        // Insert Appointments (Booked for today)
        const today = new Date().toISOString().split('T')[0];
        await connection.query(`
            INSERT IGNORE INTO appointments (appointment_id, customer_id, service_id, employee_id, room_id, appointment_start, status) VALUES 
            (1, 1, 1, 2, 1, '${today} 10:00:00', 'COMPLETED'),
            (2, 2, 3, 3, 2, '${today} 14:00:00', 'COMPLETED'),
            (3, 3, 2, 2, 3, '${today} 16:30:00', 'BOOKED');
        `);

        // Insert Service Sessions (Completed)
        await connection.query(`
            INSERT IGNORE INTO service_sessions (session_id, appointment_id, customer_id, service_id, employee_id, source_type, actual_price, status) VALUES 
            (1, 1, 1, 1, 2, 'SINGLE_SERVICE', 300000, 'COMPLETED'),
            (2, 2, 2, 3, 3, 'SINGLE_SERVICE', 400000, 'COMPLETED');
        `);

        // Insert Payments
        await connection.query(`
            INSERT IGNORE INTO payments (payment_id, customer_id, amount, payment_method, payment_type) VALUES 
            (1, 1, 2500000, 'BANK_TRANSFER', 'PACKAGE_PREPAID'),
            (2, 2, 400000, 'CASH', 'SINGLE_SERVICE');
        `);

        console.log('Mock data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed data:', error);
        process.exit(1);
    }
}

seedData();
