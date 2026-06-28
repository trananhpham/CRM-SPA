USE spa_crm_mis;
GO

-- ========================
-- DROP TABLES (nếu đã tồn tại)
-- ========================
IF OBJECT_ID('chat_logs','U') IS NOT NULL DROP TABLE chat_logs;
IF OBJECT_ID('customer_care_logs','U') IS NOT NULL DROP TABLE customer_care_logs;
IF OBJECT_ID('customer_package_items','U') IS NOT NULL DROP TABLE customer_package_items;
IF OBJECT_ID('customer_packages','U') IS NOT NULL DROP TABLE customer_packages;
IF OBJECT_ID('package_items','U') IS NOT NULL DROP TABLE package_items;
IF OBJECT_ID('appointments','U') IS NOT NULL DROP TABLE appointments;
IF OBJECT_ID('packages','U') IS NOT NULL DROP TABLE packages;
IF OBJECT_ID('services','U') IS NOT NULL DROP TABLE services;
IF OBJECT_ID('service_categories','U') IS NOT NULL DROP TABLE service_categories;
IF OBJECT_ID('users','U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('customers','U') IS NOT NULL DROP TABLE customers;
IF OBJECT_ID('roles','U') IS NOT NULL DROP TABLE roles;
IF OBJECT_ID('rooms','U') IS NOT NULL DROP TABLE rooms;
IF OBJECT_ID('employees','U') IS NOT NULL DROP TABLE employees;
GO

-- ========================
-- TẠO BẢNG
-- ========================
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL
);

CREATE TABLE customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    gender VARCHAR(10),
    date_of_birth DATE,
    address NVARCHAR(255),
    skin_condition NVARCHAR(255),
    allergy_note NVARCHAR(255),
    customer_type VARCHAR(20) DEFAULT 'NEW',
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(role_id),
    customer_id INT REFERENCES customers(customer_id),
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE service_categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL
);

CREATE TABLE services (
    service_id INT IDENTITY(1,1) PRIMARY KEY,
    service_name NVARCHAR(150) NOT NULL,
    category_id INT REFERENCES service_categories(category_id),
    price DECIMAL(12,2) NOT NULL,
    duration_minutes INT,
    description NVARCHAR(500),
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE packages (
    package_id INT IDENTITY(1,1) PRIMARY KEY,
    package_name NVARCHAR(150) NOT NULL,
    package_price DECIMAL(12,2) NOT NULL,
    validity_days INT DEFAULT 90,
    description NVARCHAR(500),
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE package_items (
    item_id INT IDENTITY(1,1) PRIMARY KEY,
    package_id INT REFERENCES packages(package_id),
    service_id INT REFERENCES services(service_id),
    included_sessions INT DEFAULT 1
);

CREATE TABLE employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(150) NOT NULL,
    position NVARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE rooms (
    room_id INT IDENTITY(1,1) PRIMARY KEY,
    room_name NVARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE'
);

CREATE TABLE appointments (
    appointment_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    service_id INT REFERENCES services(service_id),
    employee_id INT REFERENCES employees(employee_id),
    room_id INT REFERENCES rooms(room_id),
    appointment_start DATETIME,
    appointment_end DATETIME,
    status VARCHAR(30) DEFAULT 'BOOKED',
    appointment_type VARCHAR(30) DEFAULT 'SINGLE_SERVICE',
    note NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE customer_packages (
    customer_package_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    package_id INT REFERENCES packages(package_id),
    purchase_date DATETIME DEFAULT GETDATE(),
    expiry_date DATE,
    purchase_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE customer_package_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_package_id INT REFERENCES customer_packages(customer_package_id),
    service_id INT REFERENCES services(service_id),
    total_sessions INT,
    used_sessions INT DEFAULT 0,
    remaining_sessions INT
);

CREATE TABLE customer_care_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    log_date DATETIME DEFAULT GETDATE(),
    note NVARCHAR(500),
    channel VARCHAR(50) DEFAULT 'PHONE'
);

CREATE TABLE chat_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    session_id VARCHAR(100),
    user_message NVARCHAR(1000),
    bot_reply NVARCHAR(1000),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- ========================
-- DỮ LIỆU MẪU
-- ========================
INSERT INTO roles (role_name) VALUES (N'ADMIN'), (N'CUSTOMER');
GO

INSERT INTO customers (full_name, phone, email, gender, skin_condition, customer_type, created_at) VALUES
(N'Nguyễn Thị Lan', '0901234567', 'lan.nguyen@gmail.com', 'FEMALE', N'Da khô, cần cấp ẩm', 'VIP', DATEADD(month,-3,GETDATE())),
(N'Trần Thị Mỹ Duyên', '0912345678', 'duyen.tran@gmail.com', 'FEMALE', N'Da mụn ẩn', 'RETURNING', DATEADD(month,-2,GETDATE())),
(N'Lê Ngọc Mai', '0923456789', 'mai.le@gmail.com', 'FEMALE', N'Bình thường', 'NEW', DATEADD(month,-1,GETDATE())),
(N'Phạm Thị Bích', '0934567890', 'bich.pham@gmail.com', 'FEMALE', N'Da nhạy cảm', 'VIP', DATEADD(month,-4,GETDATE())),
(N'Vũ Thị Hà', '0945678901', 'ha.vu@gmail.com', 'FEMALE', N'Da dầu', 'RETURNING', DATEADD(month,-1,GETDATE())),
(N'Hoàng Văn Nam', '0956789012', 'nam.hoang@gmail.com', 'MALE', N'Da khô', 'NEW', GETDATE()),
(N'Đặng Thị Thu', '0967890123', 'thu.dang@gmail.com', 'FEMALE', N'Da thường', 'RETURNING', DATEADD(month,-5,GETDATE())),
(N'Bùi Thị Hồng', '0978901234', 'hong.bui@gmail.com', 'FEMALE', N'Mụn cám', 'INACTIVE', DATEADD(month,-6,GETDATE())),
(N'Nguyễn Văn Tú', '0989012345', 'tu.nv@gmail.com', 'MALE', N'Da thường', 'NEW', GETDATE()),
(N'Trần Thị Kim', '0990123456', 'kim.tran@gmail.com', 'FEMALE', N'Da nhạy cảm', 'VIP', DATEADD(month,-2,GETDATE()));
GO

INSERT INTO users (username, password_hash, role_id, customer_id) VALUES
('admin', 'admin123', 1, NULL),
('khachhang', 'khachhang123', 2, 1);
GO

INSERT INTO service_categories (category_name) VALUES
(N'Chăm sóc da mặt'),
(N'Massage Body'),
(N'Trị liệu công nghệ cao'),
(N'Chăm sóc cơ thể'),
(N'Điều trị da');
GO

INSERT INTO services (service_name, category_id, price, duration_minutes, description, image_url, status) VALUES
(N'Facial Cấp Ẩm Chuyên Sâu', 1, 499000, 60, N'Làm sạch sâu, cấp ẩm đa tầng giúp da căng bóng', '/images/facial_spa.png', 'ACTIVE'),
(N'Massage Thư Giãn Toàn Thân', 2, 599000, 90, N'Sử dụng tinh dầu thiên nhiên kết hợp kỹ thuật ấn huyệt', '/images/massage_spa.png', 'ACTIVE'),
(N'Laser Toning Trẻ Hóa', 3, 1500000, 45, N'Làm đều màu da, se khít lỗ chân lông bằng công nghệ Laser mới nhất', '/images/laser_spa.png', 'ACTIVE'),
(N'Tẩy Tế Bào Chết Toàn Thân', 4, 350000, 45, N'Loại bỏ tế bào chết, làm mịn màng và sáng da', '/images/massage_spa.png', 'ACTIVE'),
(N'Trị Mụn Chuyên Sâu', 5, 650000, 75, N'Lấy nhân mụn chuẩn y khoa, chiếu ánh sáng sinh học', '/images/facial_spa.png', 'ACTIVE');
GO

INSERT INTO packages (package_name, package_price, validity_days, description, image_url, status) VALUES
(N'Combo Phục Hồi Thanh Xuân', 3900000, 180, N'Bao gồm 5 buổi Laser và 5 buổi Facial', '/images/combo_youth.png', 'ACTIVE'),
(N'Thẻ Đặc Quyền Relax', 2500000, 90, N'Gói ưu đãi dành cho massage toàn thân', '/images/vip_relax.png', 'ACTIVE'),
(N'Liệu Trình Trị Mụn Tận Gốc', 2800000, 90, N'Giải quyết triệt để vấn đề mụn, mờ thâm', '/images/acne_course.png', 'ACTIVE');
GO

INSERT INTO package_items (package_id, service_id, included_sessions) VALUES
(1, 3, 5), (1, 1, 5),
(2, 2, 10),
(3, 5, 5);
GO

INSERT INTO employees (full_name, position, status) VALUES
(N'Nguyễn Kỹ Thuật Viên A', N'KTV Cao Cấp', 'ACTIVE'),
(N'Trần Kỹ Thuật Viên B', N'KTV', 'ACTIVE'),
(N'Lê Kỹ Thuật Viên C', N'KTV Trưởng', 'ACTIVE');
GO

INSERT INTO rooms (room_name, status) VALUES
(N'Phòng 1 - VIP', 'AVAILABLE'),
(N'Phòng 2 - Standard', 'AVAILABLE'),
(N'Phòng 3 - Couple', 'AVAILABLE');
GO

INSERT INTO appointments (customer_id, service_id, employee_id, room_id, appointment_start, status, appointment_type) VALUES
(1, 1, 1, 1, DATEADD(day,-10, GETDATE()), 'COMPLETED', 'SINGLE_SERVICE'),
(2, 2, 2, 2, DATEADD(day,-7, GETDATE()), 'COMPLETED', 'SINGLE_SERVICE'),
(3, 3, 3, 1, DATEADD(day,-5, GETDATE()), 'COMPLETED', 'SINGLE_SERVICE'),
(4, 5, 1, 2, DATEADD(day,-3, GETDATE()), 'COMPLETED', 'SINGLE_SERVICE'),
(1, 2, 2, 3, GETDATE(), 'BOOKED', 'SINGLE_SERVICE'),
(5, 1, 3, 1, DATEADD(day,1, GETDATE()), 'BOOKED', 'SINGLE_SERVICE'),
(6, 4, 1, 2, DATEADD(day,2, GETDATE()), 'BOOKED', 'SINGLE_SERVICE'),
(2, 3, 2, 3, DATEADD(day,-1, GETDATE()), 'CANCELLED', 'SINGLE_SERVICE'),
(10, 1, 3, 1, DATEADD(day,-2, GETDATE()), 'COMPLETED', 'SINGLE_SERVICE'),
(7, 2, 1, 2, DATEADD(day,-4, GETDATE()), 'COMPLETED', 'SINGLE_SERVICE');
GO

INSERT INTO customer_packages (customer_id, package_id, purchase_date, expiry_date, purchase_amount, paid_amount, status) VALUES
(1, 1, DATEADD(month,-2, GETDATE()), DATEADD(day,120,GETDATE()), 3900000, 3900000, 'ACTIVE'),
(2, 2, DATEADD(month,-1, GETDATE()), DATEADD(day,60, GETDATE()), 2500000, 2500000, 'ACTIVE'),
(4, 3, DATEADD(month,-1, GETDATE()), DATEADD(day,60, GETDATE()), 2800000, 2800000, 'ACTIVE'),
(10, 1, DATEADD(month,-3, GETDATE()), DATEADD(day,30, GETDATE()), 3900000, 3900000, 'ACTIVE');
GO

INSERT INTO customer_package_items (customer_package_id, service_id, total_sessions, used_sessions, remaining_sessions) VALUES
(1, 3, 5, 2, 3),
(1, 1, 5, 1, 4),
(2, 2, 10, 3, 7),
(3, 5, 5, 1, 4),
(4, 3, 5, 4, 1),
(4, 1, 5, 3, 2);
GO
