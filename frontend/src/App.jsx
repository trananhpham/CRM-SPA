import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, LogOut } from 'lucide-react';
import axios from 'axios';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import CustomerPortal from './pages/CustomerPortal';
import HomePage from './pages/HomePage';

const API_BASE_URL = '/api';

const Sidebar = ({ onLogout, userName }) => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-title">Spa CRM Admin</div>
      <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Chào, {userName}
      </div>
      <Link to="/admin/dashboard" className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
        <LayoutDashboard size={20} /> Dashboard
      </Link>
      <Link to="/admin/customers" className={`nav-link ${location.pathname === '/admin/customers' ? 'active' : ''}`}>
        <Users size={20} /> Customers
      </Link>
      <Link to="/admin/appointments" className={`nav-link ${location.pathname === '/admin/appointments' ? 'active' : ''}`}>
        <CalendarDays size={20} /> Appointments
      </Link>
      <div style={{ marginTop: 'auto' }}>
        <button onClick={onLogout} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#dc3545' }}>
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
};

const AdminLayout = ({ user, onLogout }) => {
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace />;
  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} userName={user.name} />
      <div className="main-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const CustomerLayout = ({ user, onLogout }) => {
  if (!user || user.role !== 'CUSTOMER') return <Navigate to="/login" replace />;
  return (
    <Routes>
      <Route path="dashboard" element={<CustomerPortal user={user} onLogout={onLogout} />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

const Login = ({ user, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { username, password });
      if (res.data.success) {
        setUser({ ...res.data, role: res.data.role });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối đến máy chủ.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)' }}>
      <div className="glass-panel" style={{ width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontFamily: "'Playfair Display', serif" }}>Luxury Spa Portal</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Tên đăng nhập (Username)" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
          <input 
            type="password" 
            placeholder="Mật khẩu (Password)" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
          {error && <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>Đăng nhập</button>
        </form>
        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p><strong>Database Accounts:</strong></p>
          <p>Admin: admin / demo_hash_admin</p>
          <p>Khách hàng: lanbeauty / demo_hash_lan</p>
        </div>
        <Link to="/" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/admin/*" element={<AdminLayout user={user} onLogout={handleLogout} />} />
        <Route path="/customer/*" element={<CustomerLayout user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
