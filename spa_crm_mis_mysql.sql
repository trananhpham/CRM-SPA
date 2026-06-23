-- ============================================================
-- SPA CRM + MIS DATABASE
-- MySQL version: 8.0+
-- Topic: Hệ thống Quản lý và Chăm sóc Khách hàng CRM cho Spa/Thẩm mỹ viện
-- Functions:
-- 1. Customer CRM
-- 2. Service & Package Management
-- 3. Online Appointment Scheduling
-- 4. Technician Assignment
-- 5. Automatic Package Session Deduction
-- 6. Automatic Commission Calculation
-- 7. MIS Reports: Retention Rate, Peak Hours, Revenue Reconciliation
-- ============================================================

DROP DATABASE IF EXISTS spa_crm_mis;
CREATE DATABASE spa_crm_mis
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE spa_crm_mis;

-- ============================================================
-- 1. ROLE
-- ============================================================
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB;

-- ============================================================
-- 2. CUSTOMERS
-- ============================================================
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER',
    date_of_birth DATE,
    address VARCHAR(255),
    skin_condition TEXT,
    allergy_note TEXT,
    customer_type ENUM('NEW', 'RETURNING', 'VIP', 'INACTIVE') DEFAULT 'NEW',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. EMPLOYEES
-- ============================================================
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    position ENUM('ADMIN', 'RECEPTIONIST', 'TECHNICIAN', 'MANAGER') NOT NULL,
    base_salary DECIMAL(12,2) DEFAULT 0,
    default_commission_rate DECIMAL(5,2) DEFAULT 0,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (default_commission_rate >= 0 AND default_commission_rate <= 100)
) ENGINE=InnoDB;

-- ============================================================
-- 4. USERS LOGIN
-- ============================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    customer_id INT NULL,
    employee_id INT NULL,
    status ENUM('ACTIVE', 'LOCKED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
) ENGINE=InnoDB;

-- ============================================================
-- 5. ROOMS
-- ============================================================
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(100) NOT NULL,
    status ENUM('AVAILABLE', 'MAINTENANCE', 'INACTIVE') DEFAULT 'AVAILABLE'
) ENGINE=InnoDB;

-- ============================================================
-- 6. SERVICE CATEGORIES
-- ============================================================
CREATE TABLE service_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB;

-- ============================================================
-- 7. SERVICES
-- ============================================================
CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    duration_minutes INT NOT NULL,
    default_commission_rate DECIMAL(5,2) DEFAULT 0,
    description TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',

    FOREIGN KEY (category_id) REFERENCES service_categories(category_id),
    CHECK (price >= 0),
    CHECK (duration_minutes > 0),
    CHECK (default_commission_rate >= 0 AND default_commission_rate <= 100)
) ENGINE=InnoDB;

-- ============================================================
-- 8. PACKAGES
-- Service package master
-- ============================================================
CREATE TABLE packages (
    package_id INT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,
    package_price DECIMAL(12,2) NOT NULL,
    validity_days INT NOT NULL,
    description TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',

    CHECK (package_price >= 0),
    CHECK (validity_days > 0)
) ENGINE=InnoDB;

-- ============================================================
-- 9. PACKAGE ITEMS
-- A package can include multiple services.
-- Example:
-- VIP package = 5 facial sessions + 5 massage sessions
-- ============================================================
CREATE TABLE package_items (
    package_item_id INT PRIMARY KEY AUTO_INCREMENT,
    package_id INT NOT NULL,
    service_id INT NOT NULL,
    included_sessions INT NOT NULL,
    revenue_per_session DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (package_id) REFERENCES packages(package_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),

    UNIQUE (package_id, service_id),
    CHECK (included_sessions > 0),
    CHECK (revenue_per_session >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 10. CUSTOMER PACKAGES
-- Packages purchased by customers
-- ============================================================
CREATE TABLE customer_packages (
    customer_package_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    package_id INT NOT NULL,
    purchase_date DATE NOT NULL,
    expiry_date DATE,
    purchase_amount DECIMAL(12,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    status ENUM('ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (package_id) REFERENCES packages(package_id),

    CHECK (purchase_amount >= 0),
    CHECK (paid_amount >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 11. CUSTOMER PACKAGE ITEMS
-- Tracks remaining sessions for each service inside a purchased package
-- ============================================================
CREATE TABLE customer_package_items (
    customer_package_item_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_package_id INT NOT NULL,
    service_id INT NOT NULL,
    total_sessions INT NOT NULL,
    used_sessions INT DEFAULT 0,
    remaining_sessions INT GENERATED ALWAYS AS (total_sessions - used_sessions) STORED,
    revenue_per_session DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (customer_package_id) REFERENCES customer_packages(customer_package_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),

    UNIQUE (customer_package_id, service_id),
    CHECK (total_sessions > 0),
    CHECK (used_sessions >= 0),
    CHECK (used_sessions <= total_sessions),
    CHECK (revenue_per_session >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 12. APPOINTMENTS
-- Online or receptionist-created booking
-- ============================================================
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    employee_id INT NULL,
    room_id INT NULL,
    customer_package_id INT NULL,

    appointment_type ENUM('SINGLE_SERVICE', 'PACKAGE_SESSION') DEFAULT 'SINGLE_SERVICE',
    appointment_start DATETIME NOT NULL,
    appointment_end DATETIME NULL,

    status ENUM('BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'BOOKED',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    FOREIGN KEY (customer_package_id) REFERENCES customer_packages(customer_package_id)
) ENGINE=InnoDB;

-- ============================================================
-- 13. PAYMENTS
-- Payment for single service or prepaid package
-- ============================================================
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    appointment_id INT NULL,
    customer_package_id INT NULL,

    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('CASH', 'BANK_TRANSFER', 'CARD', 'E_WALLET') NOT NULL,
    payment_type ENUM('SINGLE_SERVICE', 'PACKAGE_PREPAID', 'REFUND') NOT NULL,
    payment_status ENUM('PAID', 'PENDING', 'CANCELLED') DEFAULT 'PAID',
    note TEXT,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (customer_package_id) REFERENCES customer_packages(customer_package_id),

    CHECK (amount >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 14. SERVICE SESSIONS
-- Actual completed service session
-- Main table for:
-- - actual revenue
-- - package session deduction
-- - commission calculation
-- - retention rate
-- ============================================================
CREATE TABLE service_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NULL,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    employee_id INT NOT NULL,
    customer_package_id INT NULL,

    source_type ENUM('SINGLE_SERVICE', 'PACKAGE') DEFAULT 'SINGLE_SERVICE',
    session_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    actual_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    status ENUM('COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (customer_package_id) REFERENCES customer_packages(customer_package_id),

    UNIQUE (appointment_id),
    CHECK (actual_price >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 15. COMMISSIONS
-- Technician commission
-- ============================================================
CREATE TABLE commissions (
    commission_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    session_id INT NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    commission_status ENUM('PENDING', 'APPROVED', 'PAID') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (session_id) REFERENCES service_sessions(session_id),

    UNIQUE (session_id),
    CHECK (commission_rate >= 0 AND commission_rate <= 100),
    CHECK (commission_amount >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- 16. CUSTOMER CARE LOGS
-- CRM follow-up history
-- ============================================================
CREATE TABLE customer_care_logs (
    care_log_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    employee_id INT NULL,
    contact_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    contact_channel ENUM('PHONE', 'ZALO', 'SMS', 'EMAIL', 'FACEBOOK', 'DIRECT') DEFAULT 'PHONE',
    content TEXT,
    next_follow_up_date DATE,
    result ENUM('INTERESTED', 'NOT_INTERESTED', 'BOOKED', 'NO_RESPONSE', 'COMPLAINT') DEFAULT 'INTERESTED',

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
) ENGINE=InnoDB;

-- ============================================================
-- 17. FEEDBACKS
-- Customer feedback after service
-- ============================================================
CREATE TABLE feedbacks (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    session_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (session_id) REFERENCES service_sessions(session_id),

    CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_appointments_customer_time ON appointments(customer_id, appointment_start);
CREATE INDEX idx_appointments_employee_time ON appointments(employee_id, appointment_start, appointment_end);
CREATE INDEX idx_appointments_room_time ON appointments(room_id, appointment_start, appointment_end);
CREATE INDEX idx_sessions_customer_date ON service_sessions(customer_id, session_date);
CREATE INDEX idx_sessions_employee_date ON service_sessions(employee_id, session_date);
CREATE INDEX idx_payments_customer_date ON payments(customer_id, payment_date);
CREATE INDEX idx_customer_packages_customer ON customer_packages(customer_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- ------------------------------------------------------------
-- Auto set expiry_date and purchase_amount when customer buys package
-- ------------------------------------------------------------
CREATE TRIGGER trg_before_insert_customer_packages
BEFORE INSERT ON customer_packages
FOR EACH ROW
BEGIN
    DECLARE v_validity_days INT;
    DECLARE v_package_price DECIMAL(12,2);

    SELECT validity_days, package_price
    INTO v_validity_days, v_package_price
    FROM packages
    WHERE package_id = NEW.package_id;

    IF NEW.expiry_date IS NULL THEN
        SET NEW.expiry_date = DATE_ADD(NEW.purchase_date, INTERVAL v_validity_days DAY);
    END IF;

    IF NEW.purchase_amount = 0 THEN
        SET NEW.purchase_amount = v_package_price;
    END IF;
END$$

-- ------------------------------------------------------------
-- Auto create package session details after customer buys package
-- ------------------------------------------------------------
CREATE TRIGGER trg_after_insert_customer_packages
AFTER INSERT ON customer_packages
FOR EACH ROW
BEGIN
    INSERT INTO customer_package_items (
        customer_package_id,
        service_id,
        total_sessions,
        revenue_per_session
    )
    SELECT
        NEW.customer_package_id,
        service_id,
        included_sessions,
        revenue_per_session
    FROM package_items
    WHERE package_id = NEW.package_id;
END$$

-- ------------------------------------------------------------
-- Auto update paid_amount after package prepaid payment
-- ------------------------------------------------------------
CREATE TRIGGER trg_after_insert_payments
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'PAID'
       AND NEW.payment_type = 'PACKAGE_PREPAID'
       AND NEW.customer_package_id IS NOT NULL THEN

        UPDATE customer_packages
        SET paid_amount = paid_amount + NEW.amount
        WHERE customer_package_id = NEW.customer_package_id;

    END IF;
END$$

-- ------------------------------------------------------------
-- Auto calculate appointment_end and prevent technician/room conflict
-- ------------------------------------------------------------
CREATE TRIGGER trg_before_insert_appointments
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE v_duration INT;
    DECLARE v_count INT;

    SELECT duration_minutes
    INTO v_duration
    FROM services
    WHERE service_id = NEW.service_id;

    IF NEW.appointment_end IS NULL THEN
        SET NEW.appointment_end = DATE_ADD(NEW.appointment_start, INTERVAL v_duration MINUTE);
    END IF;

    IF NEW.appointment_start >= NEW.appointment_end THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Appointment start time must be before end time';
    END IF;

    -- Prevent technician conflict
    IF NEW.employee_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_count
        FROM appointments a
        WHERE a.employee_id = NEW.employee_id
          AND a.status IN ('BOOKED', 'CONFIRMED')
          AND NOT (
              NEW.appointment_end <= a.appointment_start
              OR NEW.appointment_start >= a.appointment_end
          );

        IF v_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Technician already has another appointment in this time range';
        END IF;
    END IF;

    -- Prevent room conflict
    IF NEW.room_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_count
        FROM appointments a
        WHERE a.room_id = NEW.room_id
          AND a.status IN ('BOOKED', 'CONFIRMED')
          AND NOT (
              NEW.appointment_end <= a.appointment_start
              OR NEW.appointment_start >= a.appointment_end
          );

        IF v_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Room already has another appointment in this time range';
        END IF;
    END IF;

    -- Validate package session appointment
    IF NEW.appointment_type = 'PACKAGE_SESSION' THEN
        IF NEW.customer_package_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Package appointment must have customer_package_id';
        END IF;

        SELECT COUNT(*)
        INTO v_count
        FROM customer_packages cp
        JOIN customer_package_items cpi
            ON cp.customer_package_id = cpi.customer_package_id
        WHERE cp.customer_package_id = NEW.customer_package_id
          AND cp.customer_id = NEW.customer_id
          AND cpi.service_id = NEW.service_id
          AND cp.status = 'ACTIVE'
          AND cp.expiry_date >= DATE(NEW.appointment_start)
          AND cpi.remaining_sessions > 0;

        IF v_count = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid package, expired package, or no remaining session';
        END IF;
    END IF;
END$$

-- ------------------------------------------------------------
-- Validate service session and set actual_price
-- ------------------------------------------------------------
CREATE TRIGGER trg_before_insert_service_sessions
BEFORE INSERT ON service_sessions
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    DECLARE v_price DECIMAL(12,2);

    -- Check appointment consistency
    IF NEW.appointment_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_count
        FROM appointments
        WHERE appointment_id = NEW.appointment_id
          AND customer_id = NEW.customer_id
          AND service_id = NEW.service_id;

        IF v_count = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Appointment does not match customer or service';
        END IF;
    END IF;

    -- Package session validation
    IF NEW.source_type = 'PACKAGE' THEN
        IF NEW.customer_package_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Package session must have customer_package_id';
        END IF;

        SELECT COUNT(*)
        INTO v_count
        FROM customer_packages cp
        JOIN customer_package_items cpi
            ON cp.customer_package_id = cpi.customer_package_id
        WHERE cp.customer_package_id = NEW.customer_package_id
          AND cp.customer_id = NEW.customer_id
          AND cpi.service_id = NEW.service_id
          AND cp.status = 'ACTIVE'
          AND cp.expiry_date >= DATE(NEW.session_date)
          AND cpi.remaining_sessions > 0;

        IF v_count = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Package is invalid, expired, completed, or has no remaining session';
        END IF;

        SELECT revenue_per_session
        INTO v_price
        FROM customer_package_items
        WHERE customer_package_id = NEW.customer_package_id
          AND service_id = NEW.service_id;

        IF NEW.actual_price = 0 THEN
            SET NEW.actual_price = v_price;
        END IF;

    ELSE
        -- Single service price
        SELECT price
        INTO v_price
        FROM services
        WHERE service_id = NEW.service_id;

        IF NEW.actual_price = 0 THEN
            SET NEW.actual_price = v_price;
        END IF;
    END IF;
END$$

-- ------------------------------------------------------------
-- After completed service session:
-- 1. Deduct package session
-- 2. Update package status if completed
-- 3. Create commission
-- 4. Update appointment status
-- ------------------------------------------------------------
CREATE TRIGGER trg_after_insert_service_sessions
AFTER INSERT ON service_sessions
FOR EACH ROW
BEGIN
    DECLARE v_rate DECIMAL(5,2);
    DECLARE v_remaining_count INT;

    IF NEW.status = 'COMPLETED' THEN

        -- Deduct one session from package
        IF NEW.source_type = 'PACKAGE' THEN
            UPDATE customer_package_items
            SET used_sessions = used_sessions + 1
            WHERE customer_package_id = NEW.customer_package_id
              AND service_id = NEW.service_id;

            -- Mark package completed if no remaining sessions
            SELECT COUNT(*)
            INTO v_remaining_count
            FROM customer_package_items
            WHERE customer_package_id = NEW.customer_package_id
              AND remaining_sessions > 0;

            IF v_remaining_count = 0 THEN
                UPDATE customer_packages
                SET status = 'COMPLETED'
                WHERE customer_package_id = NEW.customer_package_id;
            END IF;
        END IF;

        -- Commission rate: service rate first, then employee default rate
        SELECT default_commission_rate
        INTO v_rate
        FROM services
        WHERE service_id = NEW.service_id;

        IF v_rate IS NULL OR v_rate = 0 THEN
            SELECT default_commission_rate
            INTO v_rate
            FROM employees
            WHERE employee_id = NEW.employee_id;
        END IF;

        INSERT INTO commissions (
            employee_id,
            session_id,
            commission_rate,
            commission_amount
        )
        VALUES (
            NEW.employee_id,
            NEW.session_id,
            v_rate,
            NEW.actual_price * v_rate / 100
        );

        IF NEW.appointment_id IS NOT NULL THEN
            UPDATE appointments
            SET status = 'COMPLETED'
            WHERE appointment_id = NEW.appointment_id;
        END IF;

    END IF;
END$$

DELIMITER ;

-- ============================================================
-- MIS VIEWS
-- ============================================================

-- ------------------------------------------------------------
-- 1. Retention Rate by month
-- Returning customer = customer who had completed service before current month
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_mis_retention_monthly AS
SELECT
    month_start,
    total_customers,
    returning_customers,
    ROUND(returning_customers / NULLIF(total_customers, 0) * 100, 2) AS retention_rate_percent
FROM (
    SELECT
        DATE_FORMAT(s.session_date, '%Y-%m-01') AS month_start,
        COUNT(DISTINCT s.customer_id) AS total_customers,
        COUNT(DISTINCT CASE
            WHEN EXISTS (
                SELECT 1
                FROM service_sessions s2
                WHERE s2.customer_id = s.customer_id
                  AND s2.status = 'COMPLETED'
                  AND s2.session_date < STR_TO_DATE(DATE_FORMAT(s.session_date, '%Y-%m-01'), '%Y-%m-%d')
            )
            THEN s.customer_id
        END) AS returning_customers
    FROM service_sessions s
    WHERE s.status = 'COMPLETED'
    GROUP BY DATE_FORMAT(s.session_date, '%Y-%m-01')
) x;

-- ------------------------------------------------------------
-- 2. Service frequency by hour
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_mis_service_frequency_by_hour AS
SELECT
    HOUR(appointment_start) AS hour_number,
    CONCAT(LPAD(HOUR(appointment_start), 2, '0'), ':00') AS hour_label,
    COUNT(*) AS total_appointments
FROM appointments
WHERE status IN ('BOOKED', 'CONFIRMED', 'COMPLETED')
GROUP BY HOUR(appointment_start)
ORDER BY hour_number;

-- ------------------------------------------------------------
-- 3. Prepaid package revenue vs actual performed revenue
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_mis_prepaid_vs_actual_revenue AS
SELECT
    cp.customer_package_id,
    c.full_name AS customer_name,
    p.package_name,
    cp.purchase_date,
    cp.expiry_date,
    cp.purchase_amount,
    cp.paid_amount,

    COALESCE((
        SELECT SUM(ss.actual_price)
        FROM service_sessions ss
        WHERE ss.customer_package_id = cp.customer_package_id
          AND ss.status = 'COMPLETED'
    ), 0) AS actual_revenue,

    cp.paid_amount - COALESCE((
        SELECT SUM(ss.actual_price)
        FROM service_sessions ss
        WHERE ss.customer_package_id = cp.customer_package_id
          AND ss.status = 'COMPLETED'
    ), 0) AS unearned_revenue,

    COALESCE((
        SELECT SUM(cpi.total_sessions)
        FROM customer_package_items cpi
        WHERE cpi.customer_package_id = cp.customer_package_id
    ), 0) AS total_sessions,

    COALESCE((
        SELECT SUM(cpi.used_sessions)
        FROM customer_package_items cpi
        WHERE cpi.customer_package_id = cp.customer_package_id
    ), 0) AS used_sessions,

    COALESCE((
        SELECT SUM(cpi.remaining_sessions)
        FROM customer_package_items cpi
        WHERE cpi.customer_package_id = cp.customer_package_id
    ), 0) AS remaining_sessions,

    cp.status
FROM customer_packages cp
JOIN customers c ON cp.customer_id = c.customer_id
JOIN packages p ON cp.package_id = p.package_id;

-- ------------------------------------------------------------
-- 4. Employee commission by month
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_mis_employee_commission_monthly AS
SELECT
    DATE_FORMAT(ss.session_date, '%Y-%m-01') AS month_start,
    e.employee_id,
    e.full_name AS employee_name,
    COUNT(ss.session_id) AS total_sessions,
    SUM(ss.actual_price) AS total_service_revenue,
    SUM(c.commission_amount) AS total_commission
FROM commissions c
JOIN employees e ON c.employee_id = e.employee_id
JOIN service_sessions ss ON c.session_id = ss.session_id
GROUP BY
    DATE_FORMAT(ss.session_date, '%Y-%m-01'),
    e.employee_id,
    e.full_name;

-- ------------------------------------------------------------
-- 5. Monthly dashboard summary
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_mis_monthly_dashboard AS
SELECT
    m.month_start,

    COALESCE((
        SELECT COUNT(*)
        FROM appointments a
        WHERE DATE_FORMAT(a.appointment_start, '%Y-%m-01') = m.month_start
    ), 0) AS total_appointments,

    COALESCE((
        SELECT COUNT(*)
        FROM service_sessions ss
        WHERE DATE_FORMAT(ss.session_date, '%Y-%m-01') = m.month_start
          AND ss.status = 'COMPLETED'
    ), 0) AS completed_sessions,

    COALESCE((
        SELECT SUM(amount)
        FROM payments p
        WHERE DATE_FORMAT(p.payment_date, '%Y-%m-01') = m.month_start
          AND p.payment_status = 'PAID'
    ), 0) AS cash_collected,

    COALESCE((
        SELECT SUM(actual_price)
        FROM service_sessions ss
        WHERE DATE_FORMAT(ss.session_date, '%Y-%m-01') = m.month_start
          AND ss.status = 'COMPLETED'
    ), 0) AS actual_revenue,

    COALESCE((
        SELECT SUM(commission_amount)
        FROM commissions c
        JOIN service_sessions ss ON c.session_id = ss.session_id
        WHERE DATE_FORMAT(ss.session_date, '%Y-%m-01') = m.month_start
    ), 0) AS total_commission

FROM (
    SELECT DISTINCT DATE_FORMAT(session_date, '%Y-%m-01') AS month_start
    FROM service_sessions

    UNION

    SELECT DISTINCT DATE_FORMAT(payment_date, '%Y-%m-01') AS month_start
    FROM payments

    UNION

    SELECT DISTINCT DATE_FORMAT(appointment_start, '%Y-%m-01') AS month_start
    FROM appointments
) m;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- ROLE
INSERT INTO roles (role_name, description) VALUES
('ADMIN', 'Quản trị hệ thống'),
('RECEPTIONIST', 'Lễ tân'),
('TECHNICIAN', 'Kỹ thuật viên'),
('CUSTOMER', 'Khách hàng');

-- CUSTOMERS
INSERT INTO customers (full_name, phone, email, gender, skin_condition, customer_type)
VALUES
('Nguyễn Thảo', '0901000001', 'thao@gmail.com', 'FEMALE', 'Da dầu, mụn nhẹ', 'NEW'),
('Trần Minh Anh', '0901000002', 'minhanh@gmail.com', 'FEMALE', 'Da khô, nám nhẹ', 'RETURNING'),
('Lê Hoàng', '0901000003', 'hoang@gmail.com', 'MALE', 'Massage thư giãn', 'VIP');

-- EMPLOYEES
INSERT INTO employees (full_name, phone, position, default_commission_rate)
VALUES
('Lan Beauty', '0911000001', 'TECHNICIAN', 10),
('Hương Spa', '0911000002', 'TECHNICIAN', 12),
('Mai Reception', '0911000003', 'RECEPTIONIST', 0),
('Admin Spa', '0911000004', 'ADMIN', 0);

-- USERS
INSERT INTO users (username, password_hash, role_id, employee_id)
VALUES
('admin', 'demo_hash_admin', 1, 4),
('reception01', 'demo_hash_reception', 2, 3),
('lanbeauty', 'demo_hash_lan', 3, 1),
('huongspa', 'demo_hash_huong', 3, 2);

-- ROOMS
INSERT INTO rooms (room_name) VALUES
('Phòng 1'),
('Phòng 2'),
('Phòng 3');

-- SERVICE CATEGORIES
INSERT INTO service_categories (category_name) VALUES
('Chăm sóc da'),
('Massage'),
('Triệt lông');

-- SERVICES
INSERT INTO services (
    category_id,
    service_name,
    price,
    duration_minutes,
    default_commission_rate,
    description
)
VALUES
(1, 'Chăm sóc da cơ bản', 500000, 60, 10, 'Làm sạch, dưỡng ẩm, chăm sóc da cơ bản'),
(1, 'Chăm sóc da chuyên sâu', 800000, 90, 12, 'Điều trị chuyên sâu cho da mụn, nám'),
(2, 'Massage body', 400000, 90, 10, 'Massage thư giãn toàn thân'),
(3, 'Triệt lông', 700000, 60, 15, 'Triệt lông công nghệ cao');

-- PACKAGES
INSERT INTO packages (package_name, package_price, validity_days, description)
VALUES
('Gói chăm sóc da 10 buổi', 5000000, 90, '10 buổi chăm sóc da cơ bản'),
('Gói VIP Beauty', 6500000, 120, '5 buổi chăm sóc da chuyên sâu + 5 buổi massage body');

-- PACKAGE ITEMS
INSERT INTO package_items (package_id, service_id, included_sessions, revenue_per_session)
VALUES
(1, 1, 10, 500000);

INSERT INTO package_items (package_id, service_id, included_sessions, revenue_per_session)
VALUES
(2, 2, 5, 800000),
(2, 3, 5, 500000);

-- ============================================================
-- SAMPLE BUSINESS FLOW FOR TESTING
-- ============================================================

-- 1. Customer 1 buys package 1
INSERT INTO customer_packages (
    customer_id,
    package_id,
    purchase_date
)
VALUES
(1, 1, '2026-06-24');

-- 2. Customer pays prepaid package
INSERT INTO payments (
    customer_id,
    customer_package_id,
    amount,
    payment_method,
    payment_type
)
VALUES
(1, 1, 5000000, 'BANK_TRANSFER', 'PACKAGE_PREPAID');

-- 3. Customer books appointment using package
INSERT INTO appointments (
    customer_id,
    service_id,
    employee_id,
    room_id,
    customer_package_id,
    appointment_type,
    appointment_start,
    status,
    note
)
VALUES
(1, 1, 1, 1, 1, 'PACKAGE_SESSION', '2026-06-25 09:00:00', 'CONFIRMED', 'Buổi chăm sóc da số 1');

-- 4. Complete package service session
INSERT INTO service_sessions (
    appointment_id,
    customer_id,
    service_id,
    employee_id,
    customer_package_id,
    source_type,
    session_date
)
VALUES
(1, 1, 1, 1, 1, 'PACKAGE', '2026-06-25 10:00:00');

-- 5. Customer 2 books single service appointment
INSERT INTO appointments (
    customer_id,
    service_id,
    employee_id,
    room_id,
    appointment_type,
    appointment_start,
    status
)
VALUES
(2, 3, 2, 2, 'SINGLE_SERVICE', '2026-06-25 14:00:00', 'CONFIRMED');

-- 6. Customer 2 pays single service
INSERT INTO payments (
    customer_id,
    appointment_id,
    amount,
    payment_method,
    payment_type
)
VALUES
(2, 2, 400000, 'CASH', 'SINGLE_SERVICE');

-- 7. Complete single service session
INSERT INTO service_sessions (
    appointment_id,
    customer_id,
    service_id,
    employee_id,
    source_type,
    session_date
)
VALUES
(2, 2, 3, 2, 'SINGLE_SERVICE', '2026-06-25 15:30:00');

-- 8. CRM care logs
INSERT INTO customer_care_logs (
    customer_id,
    employee_id,
    contact_channel,
    content,
    next_follow_up_date,
    result
)
VALUES
(1, 3, 'ZALO', 'Nhắc khách lịch chăm sóc da và tư vấn sản phẩm dưỡng da sau liệu trình.', '2026-07-01', 'BOOKED'),
(2, 3, 'PHONE', 'Gọi hỏi thăm sau dịch vụ massage, khách phản hồi tốt.', '2026-07-05', 'INTERESTED');

-- 9. Feedbacks
INSERT INTO feedbacks (customer_id, session_id, rating, comment)
VALUES
(1, 1, 5, 'Dịch vụ tốt, nhân viên tư vấn kỹ.'),
(2, 2, 4, 'Massage tốt, phòng hơi lạnh.');

-- ============================================================
-- TEST QUERIES
-- ============================================================

-- Customer package remaining sessions
SELECT * FROM customer_package_items;

-- Service sessions
SELECT * FROM service_sessions;

-- Commissions
SELECT * FROM commissions;

-- Appointment status
SELECT * FROM appointments;

-- MIS 1: Retention rate
SELECT * FROM v_mis_retention_monthly;

-- MIS 2: Peak hours
SELECT * FROM v_mis_service_frequency_by_hour;

-- MIS 3: Prepaid vs actual revenue
SELECT * FROM v_mis_prepaid_vs_actual_revenue;

-- MIS 4: Employee commission monthly
SELECT * FROM v_mis_employee_commission_monthly;

-- MIS 5: Monthly dashboard
SELECT * FROM v_mis_monthly_dashboard;
