import React, { useState, useEffect } from 'react';
import { createBooking, getServices } from '../services/publicApi';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    service_id: '',
    appointment_start: '',
    note: ''
  });
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getServices().then(setServices).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Đang xử lý...');
    try {
      await createBooking(formData);
      setStatus('Đặt lịch thành công. Spa sẽ liên hệ xác nhận trong thời gian sớm nhất.');
      setFormData({ full_name: '', phone: '', email: '', service_id: '', appointment_start: '', note: '' });
    } catch (error) {
      setStatus('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <section id="booking" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-ivory rounded-3xl p-8 md:p-12 shadow-xl border border-borderLight relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark mb-4">Đặt Lịch Hẹn</h2>
              <p className="text-grayText">Vui lòng điền thông tin dưới đây, chuyên viên của chúng tôi sẽ liên hệ lại với bạn.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Họ và tên *</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white" 
                    value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Số điện thoại *</label>
                  <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Dịch vụ quan tâm *</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-borderLight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white"
                    value={formData.service_id} onChange={e => setFormData({...formData, service_id: e.target.value})}>
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(s => (
                      <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Ngày giờ dự kiến *</label>
                  <input required type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white" 
                    value={formData.appointment_start} onChange={e => setFormData({...formData, appointment_start: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">Ghi chú thêm</label>
                <textarea rows="3" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white" 
                  value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
              </div>
              
              {status && (
                <div className={`p-4 rounded-xl text-center font-medium ${status.includes('thành công') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {status}
                </div>
              )}

              <div className="text-center">
                <button type="submit" className="px-10 py-4 bg-gold-500 text-white rounded-xl font-medium text-lg hover:bg-gold-600 transition shadow-lg shadow-gold-500/30 w-full md:w-auto">
                  Xác nhận đặt lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
