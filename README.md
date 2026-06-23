# Hệ Thống Quản Lý Chăm Sóc Khách Hàng (CRM) cho Spa & Thẩm Mỹ Viện

Một giải pháp phần mềm quản lý toàn diện dành riêng cho Spa và Thẩm mỹ viện, bao gồm cả trang chủ (Landing Page) cho khách hàng và hệ thống quản trị (Admin Dashboard) chuyên nghiệp. Phần mềm được thiết kế với giao diện sang trọng, hiện đại, cùng khả năng tích hợp Trợ lý ảo (Chatbot) lấy dữ liệu trực tiếp từ Cơ sở dữ liệu.

## 🌟 Các Tính Năng Nổi Bật

### 1. Dành cho Khách Hàng (Public Website & Customer Portal)
- **Giao diện sang trọng (Premium UI/UX):** Tone màu trắng kem và vàng gold chuẩn thẩm mỹ viện cao cấp.
- **Xem dịch vụ & Bảng giá:** Hiển thị tự động danh sách dịch vụ, liệu trình, hình ảnh minh hoạ từ Database.
- **Đặt lịch Online (Booking):** Khách hàng dễ dàng chọn dịch vụ, khung giờ và KTV yêu thích.
- **Cổng thông tin khách hàng (Customer Portal):** Khách hàng đăng nhập để xem lịch sử sử dụng liệu trình (Sessions), kiểm tra thẻ trả trước (Packages) còn bao nhiêu buổi, và theo dõi lịch hẹn sắp tới.
- **Trợ Lý Ảo Spa (Smart Chatbot NLP):** Tích hợp Chatbot nổi (Chat Bubble) nhận dạng từ khóa thông minh (NLP cơ bản). Chatbot có thể tra cứu giá cả, dịch vụ trực tiếp từ MySQL và trả lời câu hỏi của khách hàng, mọi cuộc trò chuyện được lưu trữ để Admin chăm sóc lại.

### 2. Dành cho Quản Lý (Admin Dashboard)
- **Báo cáo Thống kê trực quan (Analytics):** 
  - Biểu đồ **Tỷ lệ giữ chân khách hàng (Retention Rate)** theo từng tháng.
  - Biểu đồ **Khung giờ cao điểm (Peak Hours)** giúp phân bổ nhân sự hợp lý.
  - Bảng đối soát **Doanh thu thực tế vs Doanh thu thẻ trả trước (Revenue Reconciliation)**.
- **Quản lý Lịch hẹn & Dịch vụ:** Xem, thêm, sửa, xóa các lịch hẹn của khách, quản lý danh sách dịch vụ và các gói liệu trình (Packages).
- **Quản lý Hồ sơ Khách hàng:** Theo dõi tình trạng da, lịch sử làm đẹp, và phản hồi (Feedbacks) của từng khách hàng.
- **Quản trị Phân quyền:** Phân tách rõ ràng quyền hạn giữa Admin (Quản lý) và Customer (Khách hàng).

## 💻 Công Nghệ Sử Dụng (Tech Stack)

Hệ thống được phát triển theo mô hình **Client-Server** linh hoạt, dễ dàng mở rộng và bảo trì:

* **Frontend:**
  * Thư viện: **React 18**
  * Build tool: **Vite** (Giúp tốc độ build và Hot-Reload cực nhanh)
  * Styling: **Tailwind CSS** (Tùy biến giao diện linh hoạt, dễ dàng đồng bộ Design System)
  * Icons: **Lucide React**
* **Backend:**
  * Môi trường: **Node.js**
  * Framework: **Express.js** (Phục vụ API RESTful và cấu hình Route rõ ràng)
  * Cơ sở dữ liệu: **MySQL** (Relational Database mạnh mẽ, sử dụng View để xử lý tính toán báo cáo)
* **Khác:** Axios, React Router DOM, Chart.js / Recharts.

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng (Local Development)

### Yêu cầu hệ thống:
- Node.js (phiên bản 16+)
- MySQL Server (XAMPP hoặc MySQL Workbench)

### Bước 1: Khởi tạo Cơ sở dữ liệu
1. Mở MySQL/XAMPP.
2. Import file `spa_crm_mis_mysql.sql` để tạo toàn bộ cấu trúc bảng (Tables, Views, Triggers).
3. (Tùy chọn) Chạy file `seed_real.js` và `seed_sessions.js` trong thư mục `backend` để tự động chèn dữ liệu mẫu (Khách hàng, Lịch hẹn, Doanh thu) nhằm hiển thị biểu đồ đẹp mắt hơn.

### Bước 2: Cài đặt và Chạy Backend
Mở Terminal và di chuyển vào thư mục `backend`:
```bash
cd backend
npm install
# Khởi chạy server tại http://localhost:5000
npm start
```

### Bước 3: Cài đặt và Chạy Frontend
Mở một Terminal khác và di chuyển vào thư mục `frontend`:
```bash
cd frontend
npm install
# Khởi chạy giao diện tại http://localhost:5173
npm run dev
```

### Bước 4: Chạy ở chế độ Production
Nếu bạn muốn Frontend chạy chung port `5000` cùng với Backend (Deployment mode):
```bash
cd frontend
npm run build
```
Sau đó chỉ cần chạy `node server.js` ở thư mục `backend`, toàn bộ hệ thống sẽ được phục vụ tại: **http://localhost:5000**.

## 🔐 Tài khoản Demo
Khi chạy ở chế độ Production kết nối với Database có sẵn:
- **Admin:** `admin` / `demo_hash_admin`
- **Khách hàng 1:** `lanbeauty` / `demo_hash_lan`
- **Khách hàng 2:** `huongspa` / `demo_hash_huong`
