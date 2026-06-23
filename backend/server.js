const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const publicRoutes = require('./routes/public.routes');
app.use('/api/public', publicRoutes);

// --- MOCK DATABASE (In-Memory Array Fallback) ---
let mockCustomers = [
    { customer_id: 1, full_name: 'Nguyễn Văn A', phone: '0901234567', gender: 'MALE', customer_type: 'VIP', skin_condition: 'Da khô' },
    { customer_id: 2, full_name: 'Trần Thị B', phone: '0912345678', gender: 'FEMALE', customer_type: 'RETURNING', skin_condition: 'Mụn ẩn' },
    { customer_id: 3, full_name: 'Lê Thị C', phone: '0923456789', gender: 'FEMALE', customer_type: 'NEW', skin_condition: 'Bình thường' }
];

let mockAppointments = [
    { appointment_id: 1, customer_id: 1, customer_name: 'Nguyễn Văn A', service_name: 'Facial cơ bản', appointment_start: new Date().toISOString(), appointment_end: null, appointment_type: 'SINGLE_SERVICE', status: 'COMPLETED' },
    { appointment_id: 2, customer_id: 2, customer_name: 'Trần Thị B', service_name: 'Massage Body', appointment_start: new Date(Date.now() + 86400000).toISOString(), appointment_end: null, appointment_type: 'PACKAGE_SESSION', status: 'BOOKED' }
];

// --- AUTHENTICATION ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Cố gắng tìm trong bảng users của Database thật
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password_hash = ?', [username, password]);
        if (rows.length > 0) {
            const user = rows[0];
            // Lấy role_name từ roles
            const [roles] = await db.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id]);
            const role_name = roles[0] ? roles[0].role_name : 'CUSTOMER';
            return res.json({ success: true, role: role_name, user_id: user.user_id, customer_id: user.customer_id });
        }
        return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' });
    } catch (error) {
        // Fallback: Sử dụng Mock nếu MySQL chưa bật
        if (username === 'admin' && password === 'admin123') {
            return res.json({ success: true, role: 'ADMIN', user_id: 999, name: 'Quản trị viên' });
        }
        if (username === 'khachhang' && password === 'khachhang123') {
            // Giả lập KH id 1 là Nguyễn Văn A
            return res.json({ success: true, role: 'CUSTOMER', user_id: 888, customer_id: 1, name: 'Nguyễn Văn A' });
        }
        return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác! (Chế độ Mock)' });
    }
});

// --- CUSTOMER PORTAL DATA ---
app.get('/api/customer/:id/dashboard', async (req, res) => {
    const customerId = req.params.id;
    try {
        // Lấy lịch hẹn của khách
        const [appointments] = await db.query(`
            SELECT a.appointment_id as id, s.service_name as service, a.appointment_start as date, a.status 
            FROM appointments a 
            JOIN services s ON a.service_id = s.service_id 
            WHERE a.customer_id = ? ORDER BY a.appointment_start DESC
        `, [customerId]);

        // Lấy gói liệu trình
        const [packages] = await db.query(`
            SELECT cp.customer_package_id as id, p.package_name as name, cpi.total_sessions as total, cpi.used_sessions as used, cpi.remaining_sessions as remaining, cp.expiry_date as expiry
            FROM customer_packages cp
            JOIN packages p ON cp.package_id = p.package_id
            JOIN customer_package_items cpi ON cp.customer_package_id = cpi.customer_package_id
            WHERE cp.customer_id = ?
        `, [customerId]);

        res.json({ appointments, packages });
    } catch (error) {
        // Fallback
        const myAppts = mockAppointments
            .filter(a => a.customer_id == customerId)
            .map(a => ({ id: a.appointment_id, service: a.service_name, date: a.appointment_start, status: a.status }));
        
        res.json({
            appointments: myAppts,
            packages: [
                { id: 1, name: 'Gói Trị mụn chuyên sâu', total: 10, used: 3, remaining: 7, expiry: '2026-12-31' }
            ]
        });
    }
});

// --- CUSTOMERS CRUD ---
app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.json(mockCustomers.filter(c => c.customer_type !== 'INACTIVE'));
    }
});

app.post('/api/customers', async (req, res) => {
    const { full_name, phone, email, gender, date_of_birth, address, skin_condition, allergy_note, customer_type } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO customers (full_name, phone, email, gender, date_of_birth, address, skin_condition, allergy_note, customer_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [full_name, phone, email, gender, date_of_birth, address, skin_condition, allergy_note, customer_type || 'NEW']
        );
        res.status(201).json({ id: result.insertId, message: 'Customer created' });
    } catch (error) {
        const newCustomer = {
            customer_id: mockCustomers.length + 1,
            full_name, phone, gender, skin_condition, customer_type: customer_type || 'NEW'
        };
        mockCustomers.unshift(newCustomer);
        res.status(201).json({ id: newCustomer.customer_id, message: 'Customer created (Mock)' });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        await db.query('UPDATE customers SET customer_type = "INACTIVE" WHERE customer_id = ?', [req.params.id]);
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        const id = parseInt(req.params.id);
        mockCustomers = mockCustomers.map(c => c.customer_id === id ? { ...c, customer_type: 'INACTIVE' } : c);
        res.json({ message: 'Customer deleted (Mock)' });
    }
});

// --- APPOINTMENTS CRUD ---
app.get('/api/appointments', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, c.full_name as customer_name, s.service_name 
            FROM appointments a
            JOIN customers c ON a.customer_id = c.customer_id
            JOIN services s ON a.service_id = s.service_id
            ORDER BY a.appointment_start DESC
        `);
        res.json(rows);
    } catch (error) {
        res.json(mockAppointments.filter(a => a.status !== 'CANCELLED'));
    }
});

app.post('/api/appointments', async (req, res) => {
    const { customer_id, service_id, employee_id, room_id, appointment_start } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO appointments (customer_id, service_id, employee_id, room_id, appointment_start) VALUES (?, ?, ?, ?, ?)',
            [customer_id, service_id, employee_id, room_id, appointment_start]
        );
        res.status(201).json({ id: result.insertId, message: 'Appointment created' });
    } catch (error) {
        const newAppt = {
            appointment_id: mockAppointments.length + 1,
            customer_id: customer_id || 1,
            customer_name: 'Khách hàng mới',
            service_name: 'Dịch vụ tùy chọn',
            appointment_start: new Date(appointment_start).toISOString(),
            appointment_type: 'SINGLE_SERVICE',
            status: 'BOOKED'
        };
        mockAppointments.unshift(newAppt);
        res.status(201).json({ id: newAppt.appointment_id, message: 'Appointment created (Mock)' });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        await db.query('UPDATE appointments SET status = "CANCELLED" WHERE appointment_id = ?', [req.params.id]);
        res.json({ message: 'Appointment cancelled' });
    } catch (error) {
        const id = parseInt(req.params.id);
        mockAppointments = mockAppointments.map(a => a.appointment_id === id ? { ...a, status: 'CANCELLED' } : a);
        res.json({ message: 'Appointment cancelled (Mock)' });
    }
});

// --- REPORTS ---
app.get('/api/reports/retention', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM v_mis_retention_monthly ORDER BY month_start ASC');
        res.json(rows);
    } catch (error) {
        res.json([
            { month_start: '2026-01-01', retention_rate_percent: '45.5' }, { month_start: '2026-02-01', retention_rate_percent: '50.2' },
            { month_start: '2026-03-01', retention_rate_percent: '55.0' }, { month_start: '2026-04-01', retention_rate_percent: '62.1' },
            { month_start: '2026-05-01', retention_rate_percent: '68.5' }, { month_start: '2026-06-01', retention_rate_percent: '75.0' }
        ]);
    }
});

app.get('/api/reports/peak-hours', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM v_mis_service_frequency_by_hour ORDER BY hour_number ASC');
        res.json(rows);
    } catch (error) {
        res.json([
            { hour_label: '08:00', total_appointments: 12 }, { hour_label: '09:00', total_appointments: 25 },
            { hour_label: '10:00', total_appointments: 40 }, { hour_label: '11:00', total_appointments: 35 },
            { hour_label: '12:00', total_appointments: 15 }, { hour_label: '13:00', total_appointments: 20 },
            { hour_label: '14:00', total_appointments: 45 }, { hour_label: '15:00', total_appointments: 55 },
            { hour_label: '16:00', total_appointments: 60 }, { hour_label: '17:00', total_appointments: 80 },
            { hour_label: '18:00', total_appointments: 75 }, { hour_label: '19:00', total_appointments: 40 }
        ]);
    }
});

app.get('/api/reports/revenue-reconciliation', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM v_mis_prepaid_vs_actual_revenue');
        res.json(rows);
    } catch (error) {
        res.json([
            { customer_name: 'Nguyễn Văn A', package_name: 'Gói Facial 10 Buổi', paid_amount: 2500000, actual_revenue: 750000, unearned_revenue: 1750000, total_sessions: 10, used_sessions: 3, status: 'ACTIVE' },
            { customer_name: 'Trần Thị B', package_name: 'Gói Triệt lông 5 Buổi', paid_amount: 3000000, actual_revenue: 3000000, unearned_revenue: 0, total_sessions: 5, used_sessions: 5, status: 'COMPLETED' }
        ]);
    }
});

// React Catch-all
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
