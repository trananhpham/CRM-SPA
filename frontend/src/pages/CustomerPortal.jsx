import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

const CustomerPortal = ({ user, onLogout }) => {
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // user.customer_id (hoặc id mặc định 1 nếu mock)
        const custId = user?.customer_id || 1;
        const res = await axios.get(`${API_BASE_URL}/customer/${custId}/dashboard`);
        setAppointments(res.data.appointments);
        setPackages(res.data.packages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="loading">Đang tải dữ liệu của bạn...</div>;

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Customer Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Chào mừng bạn quay trở lại, {user?.name || 'Khách Hàng'}!</p>
        </div>
        <button className="btn-danger" onClick={onLogout}>Đăng xuất</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Panel Lịch hẹn */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Lịch hẹn của tôi</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td style={{ fontWeight: '500' }}>{appt.service}</td>
                    <td>{new Date(appt.date).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${appt.status === 'COMPLETED' ? 'badge-active' : 'badge-vip'}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>Bạn chưa có lịch hẹn nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>+ Đặt lịch hẹn mới</button>
        </div>

        {/* Panel Gói dịch vụ (Liệu trình) */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Gói Liệu Trình (Thẻ thành viên)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Gói</th>
                  <th>Đã dùng / Tổng</th>
                  <th>Hạn sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id}>
                    <td style={{ fontWeight: '500' }}>{pkg.name}</td>
                    <td>
                      <span style={{ color: 'var(--primary-hover)', fontWeight: 'bold' }}>{pkg.remaining}</span> buổi còn lại (Đã dùng {pkg.used}/{pkg.total})
                    </td>
                    <td>{pkg.expiry ? new Date(pkg.expiry).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>Bạn chưa mua gói dịch vụ nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerPortal;
