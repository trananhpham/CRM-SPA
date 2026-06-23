import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer_id: 1, service_id: 1, employee_id: 1, room_id: 1, appointment_start: '' });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments`);
      setAppointments(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/appointments`, formData);
      setShowModal(false);
      setFormData({ customer_id: 1, service_id: 1, employee_id: 1, room_id: 1, appointment_start: '' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      try {
        await axios.delete(`${API_BASE_URL}/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Appointments</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Appointment
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', background: 'var(--surface-color)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>New Appointment</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select required value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <option value="1">Khách hàng 1</option>
                <option value="2">Khách hàng 2</option>
                <option value="3">Khách hàng 3</option>
              </select>
              <select required value={formData.service_id} onChange={e => setFormData({...formData, service_id: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <option value="1">Facial cơ bản</option>
                <option value="2">Trị mụn chuyên sâu</option>
                <option value="3">Massage thư giãn 60p</option>
              </select>
              <input required type="datetime-local" value={formData.appointment_start} onChange={e => setFormData({...formData, appointment_start: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
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
                <th>Customer</th>
                <th>Service</th>
                <th>Start Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.appointment_id}>
                  <td style={{ fontWeight: '500' }}>{a.customer_name}</td>
                  <td>{a.service_name}</td>
                  <td>{new Date(a.appointment_start).toLocaleString()}</td>
                  <td>{a.appointment_type.replace('_', ' ')}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'COMPLETED' ? 'badge-active' :
                      a.status === 'BOOKED' ? 'badge-new' :
                      a.status === 'CONFIRMED' ? 'badge-vip' : ''
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                      <button className="btn-danger" onClick={() => handleCancel(a.appointment_id)}>Cancel Appt</button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
