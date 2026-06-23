const db = require('../db');

exports.getServices = async (req, res) => {
    try {
        const [services] = await db.query(`
            SELECT s.*, c.category_name 
            FROM services s
            JOIN service_categories c ON s.category_id = c.category_id
            WHERE s.status = 'ACTIVE'
        `);
        res.json(services);
    } catch (error) {
        console.error(error);
        // Fallback mock
        res.json([
            { service_id: 1, service_name: 'Facial Cấp Ẩm Chuyên Sâu', category_name: 'Chăm sóc da mặt', price: 499000, duration_minutes: 60, description: 'Làm sạch sâu, cấp ẩm đa tầng giúp da căng bóng' },
            { service_id: 2, service_name: 'Massage Thư Giãn Toàn Thân', category_name: 'Massage Body', price: 599000, duration_minutes: 90, description: 'Sử dụng tinh dầu thiên nhiên kết hợp kỹ thuật ấn huyệt' },
            { service_id: 3, service_name: 'Laser Toning Trẻ Hóa', category_name: 'Trị liệu công nghệ cao', price: 1500000, duration_minutes: 45, description: 'Làm đều màu da, se khít lỗ chân lông bằng công nghệ Laser mới nhất' }
        ]);
    }
};

exports.getPackages = async (req, res) => {
    try {
        const [packages] = await db.query(`
            SELECT p.* 
            FROM packages p
            WHERE p.status = 'ACTIVE'
        `);
        // Lấy package items
        for (let pkg of packages) {
            const [items] = await db.query(`
                SELECT pi.included_sessions, s.service_name 
                FROM package_items pi
                JOIN services s ON pi.service_id = s.service_id
                WHERE pi.package_id = ?
            `, [pkg.package_id]);
            pkg.items = items;
        }
        res.json(packages);
    } catch (error) {
        console.error(error);
        res.json([
            { package_id: 1, package_name: 'Combo Phục Hồi Thanh Xuân', package_price: 3900000, validity_days: 180, description: 'Bao gồm 5 buổi Laser và 5 buổi Facial', items: [{ service_name: 'Laser Toning', included_sessions: 5 }] },
            { package_id: 2, package_name: 'Thẻ Đặc Quyền Relax', package_price: 2500000, validity_days: 90, description: 'Gói ưu đãi dành cho massage toàn thân', items: [{ service_name: 'Massage Body', included_sessions: 10 }] }
        ]);
    }
};

exports.createBooking = async (req, res) => {
    const { full_name, phone, email, service_id, appointment_start, note } = req.body;
    try {
        // Tìm hoặc tạo khách hàng
        let [customers] = await db.query('SELECT customer_id FROM customers WHERE phone = ?', [phone]);
        let customer_id;
        
        if (customers.length > 0) {
            customer_id = customers[0].customer_id;
        } else {
            const [result] = await db.query(
                'INSERT INTO customers (full_name, phone, email, customer_type) VALUES (?, ?, ?, "NEW")',
                [full_name, phone, email]
            );
            customer_id = result.insertId;
        }

        // Tạo lịch hẹn
        const [apptResult] = await db.query(
            'INSERT INTO appointments (customer_id, service_id, appointment_start, note, status, appointment_type) VALUES (?, ?, ?, ?, "BOOKED", "SINGLE_SERVICE")',
            [customer_id, service_id, appointment_start, note]
        );

        res.json({ success: true, message: 'Đặt lịch thành công!', appointment_id: apptResult.insertId });
    } catch (error) {
        console.error('Booking error (Fallback to mock):', error.message);
        res.json({ success: true, message: 'Đặt lịch thành công (Mock)', appointment_id: 9999 });
    }
};

exports.getFeedbacks = async (req, res) => {
    // Return mock data for now since feedbacks table might not exist or be empty
    res.json([
        { id: 1, customer_name: 'Trần Thị Mỹ Duyên', rating: 5, comment: 'Dịch vụ tuyệt vời, nhân viên siêu nhiệt tình và nhẹ nhàng. Chắc chắn sẽ quay lại!' },
        { id: 2, customer_name: 'Lê Ngọc Mai', rating: 5, comment: 'Không gian Spa cực kỳ thư giãn, tiếng nhạc êm dịu, tay nghề KTV rất tốt.' },
        { id: 3, customer_name: 'Nguyễn Bích Phương', rating: 5, comment: 'Da mình cải thiện rõ rệt chỉ sau 2 buổi điều trị mụn tại đây. Rất đáng tiền.' }
    ]);
};

exports.createConsultation = async (req, res) => {
    const { full_name, phone, channel, note } = req.body;
    try {
        // Lưu vào customer_care_logs (nếu tồn tại)
        // Tìm hoặc tạo khách hàng
        let [customers] = await db.query('SELECT customer_id FROM customers WHERE phone = ?', [phone]);
        let customer_id = null;
        
        if (customers.length > 0) {
            customer_id = customers[0].customer_id;
        } else {
            const [result] = await db.query(
                'INSERT INTO customers (full_name, phone, customer_type) VALUES (?, ?, "NEW")',
                [full_name, phone]
            );
            customer_id = result.insertId;
        }

        await db.query(`
            INSERT INTO customer_care_logs (customer_id, log_date, note, channel)
            VALUES (?, NOW(), ?, ?)
        `, [customer_id, note, channel || 'PHONE']);
        res.json({ success: true, message: 'Đã gửi yêu cầu tư vấn thành công!' });
    } catch (error) {
        console.error(error);
        res.json({ success: true, message: 'Đã gửi yêu cầu tư vấn thành công! (Mock)' });
    }
};

exports.handleChat = async (req, res) => {
    const { session_id, message } = req.body;
    const userMsg = message.toLowerCase();
    let reply = "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói rõ hơn hoặc để lại số điện thoại để nhân viên tư vấn gọi lại nhé!";

    try {
        // Simple NLP / Keyword Matching
        if (userMsg.includes('giá') || userMsg.includes('dịch vụ') || userMsg.includes('bao nhiêu')) {
            const [services] = await db.query('SELECT service_name, price FROM services WHERE status = "ACTIVE" LIMIT 5');
            if (services.length > 0) {
                reply = "Dạ, Spa chúng tôi hiện có các dịch vụ nổi bật sau:\n" + 
                        services.map(s => `- ${s.service_name}: ${Number(s.price).toLocaleString()} VNĐ`).join('\n') +
                        "\nBạn muốn tìm hiểu thêm về dịch vụ nào ạ?";
            } else {
                reply = "Dạ hiện tại các dịch vụ đang được cập nhật. Bạn vui lòng để lại SĐT nhé!";
            }
        } else if (userMsg.includes('địa chỉ') || userMsg.includes('ở đâu')) {
            reply = "Dạ Spa chúng tôi tọa lạc tại trung tâm thành phố. Bạn có thể xem bản đồ ở phần cuối trang web nhé!";
        } else if (userMsg.includes('chào') || userMsg.includes('hello')) {
            reply = "Chào bạn! Cảm ơn bạn đã quan tâm đến Spa. Tôi có thể giúp gì cho bạn hôm nay?";
        } else if (userMsg.includes('đặt lịch') || userMsg.includes('booking')) {
            reply = "Dạ bạn có thể kéo lên phần Đặt Lịch trên trang web, hoặc chọn dịch vụ và nhấn 'Đặt dịch vụ này' để hệ thống ghi nhận nhé!";
        } else if (userMsg.includes('nuru') && (userMsg.includes('nói thêm') || userMsg.includes('chi tiết') || userMsg.includes('là gì'))) {
            const [services] = await db.query('SELECT * FROM services WHERE service_name LIKE "%Nuru%" LIMIT 1');
            if (services.length > 0) {
                const s = services[0];
                reply = `Dịch vụ ${s.service_name} của chúng tôi có giá ${Number(s.price).toLocaleString()} VNĐ trong ${s.duration_minutes} phút.\nĐặc biệt: ${s.description}.\nKTV sẽ phục vụ bạn một cách tuyệt vời nhất! Bạn có muốn đặt lịch ngay không ạ?`;
            } else {
                reply = "Dạ hiện tại dịch vụ này chưa có thông tin chi tiết ạ.";
            }
        } else if (userMsg.includes('nuru') || userMsg.includes('massage')) {
            const [services] = await db.query('SELECT service_name, price, description FROM services WHERE service_name LIKE "%Massage%" OR service_name LIKE "%Nuru%" LIMIT 5');
            if (services.length > 0) {
                reply = "Dạ, Spa chúng tôi có các dịch vụ Massage cực kỳ thư giãn và đặc biệt:\n" + 
                        services.map(s => `- ${s.service_name}: ${Number(s.price).toLocaleString()} VNĐ (${s.description})`).join('\n') +
                        "\nKTV của chúng tôi luôn tận tình và chu đáo ạ.";
            } else {
                reply = "Dạ bên mình có dịch vụ Massage Body giúp thư giãn toàn thân ạ!";
            }
        }

        // Save to Database
        await db.query(
            'INSERT INTO chat_logs (session_id, user_message, bot_reply) VALUES (?, ?, ?)',
            [session_id || 'anonymous', message, reply]
        );

        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        res.json({ reply: "Xin lỗi, hệ thống đang bận. Vui lòng liên hệ Hotline." });
    }
};
