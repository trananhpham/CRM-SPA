import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', gender: 'FEMALE', skin_condition: '' });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/customers`, formData);
      setShowModal(false);
      setFormData({ full_name: '', phone: '', gender: 'FEMALE', skin_condition: '' });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa (Soft Delete) khách hàng này?')) {
      try {
        await axios.delete(`${API_BASE_URL}/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading customers...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Customer Management</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New Customer
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', background: 'var(--surface-color)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Add Customer</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" placeholder="Họ và tên" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
              <input required type="text" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <option value="FEMALE">Nữ</option>
                <option value="MALE">Nam</option>
              </select>
              <input type="text" placeholder="Tình trạng da" value={formData.skin_condition} onChange={e => setFormData({...formData, skin_condition: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn-danger" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-panel">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Type</th>
                <th>Skin Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customer_id}>
                  <td style={{ fontWeight: '500' }}>{c.full_name}</td>
                  <td>{c.phone}</td>
                  <td>{c.gender}</td>
                  <td>
                    <span className={`badge ${c.customer_type === 'VIP' ? 'badge-vip' : c.customer_type === 'NEW' ? 'badge-new' : 'badge-active'}`}>
                      {c.customer_type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.skin_condition || 'N/A'}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(c.customer_id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
