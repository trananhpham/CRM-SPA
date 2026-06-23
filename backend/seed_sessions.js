const db = require('./db');

async function seedSessions() {
    try {
        console.log('Đang tạo dữ liệu cho bảng service_sessions để vẽ biểu đồ Retention...');
        
        // 1. Kiểm tra / Tạo nhân viên
        const [emps] = await db.query('SELECT employee_id FROM employees');
        let employee_id = 1;
        if (emps.length === 0) {
            const [res] = await db.query('INSERT INTO employees (full_name, phone) VALUES ("KTV Test", "0999999999")');
            employee_id = res.insertId;
        } else {
            employee_id = emps[0].employee_id;
        }

        // 2. Lấy khách hàng & dịch vụ
        const [customers] = await db.query('SELECT customer_id FROM customers LIMIT 10');
        const cIds = customers.map(c => c.customer_id);
        
        const [services] = await db.query('SELECT service_id, price FROM services LIMIT 5');

        // 3. Giả lập khách hàng quay lại theo các tháng từ 1 đến 6 năm 2026
        // Kịch bản: tạo ra sự quay lại (retention) để biểu đồ sinh động
        const monthCusts = {
            1: [1,2,3,4,5],       // Tháng 1: Khách 1,2,3,4,5
            2: [1,2,3,6,7],       // Tháng 2: Khách 1,2,3 quay lại, 6,7 mới
            3: [2,3,6,8,9],       // Tháng 3: Khách 2,3,6 quay lại, 8,9 mới
            4: [3,6,8,10],        // Tháng 4: Khách 3,6,8 quay lại, 10 mới
            5: [6,8,10,1,2],      // Tháng 5: Khách 6,8,10 quay lại, 1,2 quay lại
            6: [1,2,6,8,3,4,5]    // Tháng 6: Rất đông khách quay lại
        };

        for (let m = 1; m <= 6; m++) {
            const custsForMonth = monthCusts[m];
            for (let cId of custsForMonth) {
                if (cId - 1 >= cIds.length) continue;
                const actualCId = cIds[cId - 1];
                const srv = services[Math.floor(Math.random() * services.length)];
                
                const dateStr = `2026-0${m}-15 10:00:00`;
                
                await db.query(`
                    INSERT INTO service_sessions 
                    (customer_id, service_id, employee_id, source_type, session_date, actual_price, status) 
                    VALUES (?, ?, ?, 'SINGLE_SERVICE', ?, ?, 'COMPLETED')
                `, [actualCId, srv.service_id, employee_id, dateStr, srv.price]);
            }
        }
        
        console.log('Đã tạo thành công dữ liệu cho biểu đồ Tỷ lệ giữ chân khách hàng!');
        process.exit(0);
    } catch(e) {
        console.error('Lỗi:', e);
        process.exit(1);
    }
}
seedSessions();
