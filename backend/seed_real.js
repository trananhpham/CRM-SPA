const db = require('./db');

async function seedData() {
    try {
        console.log('Bắt đầu thêm dữ liệu mẫu vào Database thật...');

        // 1. Thêm 10 khách hàng mới
        const customers = [
            ['Nguyễn Thanh Thủy', '0901111111', 'thuy@gmail.com', 'FEMALE', 'Da hỗn hợp', 'VIP'],
            ['Trần Phương Thảo', '0902222222', 'thao@gmail.com', 'FEMALE', 'Da mụn', 'RETURNING'],
            ['Lê Minh Anh', '0903333333', 'minhanh@gmail.com', 'MALE', 'Da khô', 'NEW'],
            ['Phạm Ngọc Mai', '0904444444', 'mai@gmail.com', 'FEMALE', 'Da nhạy cảm', 'VIP'],
            ['Hoàng Quốc Bảo', '0905555555', 'bao@gmail.com', 'MALE', 'Da dầu', 'RETURNING'],
            ['Đặng Thu Hà', '0906666666', 'ha@gmail.com', 'FEMALE', 'Nám tàn nhang', 'NEW'],
            ['Vũ Hải Yến', '0907777777', 'yen@gmail.com', 'FEMALE', 'Lão hóa', 'VIP'],
            ['Bùi Tuấn Kiệt', '0908888888', 'kiet@gmail.com', 'MALE', 'Sẹo rỗ', 'RETURNING'],
            ['Đỗ Bích Ngọc', '0909999999', 'ngoc@gmail.com', 'FEMALE', 'Da mụn', 'VIP'],
            ['Ngô Quỳnh Hương', '0900000000', 'huong@gmail.com', 'FEMALE', 'Bình thường', 'NEW']
        ];
        
        let customerIds = [];
        for (const c of customers) {
            // Check if phone exists
            const [existing] = await db.query('SELECT customer_id FROM customers WHERE phone = ?', [c[1]]);
            if (existing.length === 0) {
                const [res] = await db.query(
                    'INSERT INTO customers (full_name, phone, email, gender, skin_condition, customer_type) VALUES (?, ?, ?, ?, ?, ?)',
                    c
                );
                customerIds.push(res.insertId);
            } else {
                customerIds.push(existing[0].customer_id);
            }
        }
        console.log(`Đã đảm bảo có ${customerIds.length} khách hàng.`);

        // 2. Lấy danh sách services hiện có
        const [services] = await db.query('SELECT service_id FROM services');
        const serviceIds = services.map(s => s.service_id);
        if (serviceIds.length === 0) {
            console.log('Chưa có service nào trong DB!');
            process.exit(1);
        }

        // 3. Thêm Appointments (Trải dài từ 6 tháng trước đến hiện tại để có biểu đồ Retention)
        // Tạo khoảng 100 lịch hẹn ngẫu nhiên
        console.log('Đang tạo 100 lịch hẹn ngẫu nhiên...');
        const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'BOOKED', 'CANCELLED'];
        const now = new Date();
        for (let i = 0; i < 100; i++) {
            const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
            const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
            
            // Random date between now and 6 months ago
            const pastDate = new Date(now.getTime() - Math.random() * (180 * 24 * 60 * 60 * 1000));
            // Random hour between 8 and 20 (peak hours)
            pastDate.setHours(8 + Math.floor(Math.random() * 12), 0, 0, 0);
            
            // Format to MySQL datetime: YYYY-MM-DD HH:MM:SS
            const dateStr = pastDate.toISOString().slice(0, 19).replace('T', ' ');
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            const [apptRes] = await db.query(
                'INSERT INTO appointments (customer_id, service_id, appointment_start, appointment_type, status) VALUES (?, ?, ?, "SINGLE_SERVICE", ?)',
                [customerId, serviceId, dateStr, status]
            );

            // Nếu COMPLETED, tạo 1 payment
            if (status === 'COMPLETED') {
                await db.query(
                    'INSERT INTO payments (customer_id, appointment_id, amount, payment_method, payment_type, payment_status, payment_date) VALUES (?, ?, ?, "CARD", "SINGLE_SERVICE", "PAID", ?)',
                    [customerId, apptRes.insertId, 500000 + Math.floor(Math.random() * 1000000), dateStr]
                );
            }
        }
        console.log('Đã tạo xong lịch hẹn và thanh toán.');

        // 4. Thêm Customer Packages (Để biểu đồ Revenue Reconciliation có dữ liệu)
        console.log('Đang tạo các gói liệu trình cho khách...');
        const [packages] = await db.query('SELECT package_id, package_price FROM packages');
        if (packages.length > 0) {
            for (let i = 0; i < 5; i++) { // 5 khách hàng mua gói
                const customerId = customerIds[i];
                const pkg = packages[Math.floor(Math.random() * packages.length)];
                const buyDate = new Date(now.getTime() - Math.random() * (90 * 24 * 60 * 60 * 1000));
                const dateStr = buyDate.toISOString().slice(0, 19).replace('T', ' ');

                const [cpRes] = await db.query(
                    'INSERT INTO customer_packages (customer_id, package_id, purchase_date, expiry_date, purchase_amount, paid_amount, status) VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 6 MONTH), ?, ?, "ACTIVE")',
                    [customerId, pkg.package_id, dateStr, dateStr, pkg.package_price, pkg.package_price]
                );

                // Insert into customer_package_items
                const [items] = await db.query('SELECT service_id, included_sessions FROM package_items WHERE package_id = ?', [pkg.package_id]);
                for (let item of items) {
                    try {
                        const used = Math.floor(Math.random() * item.included_sessions);
                        const rev = pkg.package_price / item.included_sessions;
                        await db.query(
                            'INSERT INTO customer_package_items (customer_package_id, service_id, total_sessions, used_sessions, revenue_per_session) VALUES (?, ?, ?, ?, ?)',
                            [cpRes.insertId, item.service_id, item.included_sessions, used, rev]
                        );
                    } catch(e) {}
                }
            }
            console.log('Đã tạo xong dữ liệu gói liệu trình.');
        }

        console.log('Hoàn thành việc tạo dữ liệu Database thực!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu:', error);
        process.exit(1);
    }
}

seedData();
