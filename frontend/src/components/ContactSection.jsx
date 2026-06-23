import React, { useState } from 'react';
import { createConsultation } from '../services/publicApi';

const ContactSection = () => {
  const [formData, setFormData] = useState({ full_name: '', phone: '', channel: 'PHONE', note: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Đang gửi...');
    try {
      const res = await createConsultation(formData);
      setStatus(res.message);
      setFormData({ full_name: '', phone: '', channel: 'PHONE', note: '' });
    } catch (error) {
      setStatus('Lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-ivory">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-borderLight flex flex-col md:flex-row gap-12">
          
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-serif font-bold text-dark mb-4">Nhận Tư Vấn Miễn Phí</h2>
            <p className="text-grayText mb-8">Hãy để lại thông tin, chuyên gia da liễu của chúng tôi sẽ liên hệ tư vấn liệu trình phù hợp nhất cho bạn.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-dark">
                <div className="w-10 h-10 bg-ivory rounded-full flex items-center justify-center text-gold-500">📞</div>
                <div>
                  <p className="text-sm text-grayText">Hotline</p>
                  <p className="font-medium">1900 8888 66</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-dark">
                <div className="w-10 h-10 bg-ivory rounded-full flex items-center justify-center text-gold-500">📍</div>
                <div>
                  <p className="text-sm text-grayText">Địa chỉ</p>
                  <p className="font-medium">123 Đường Sắc Đẹp, Q.1, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" placeholder="Họ và tên" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:border-gold-500 outline-none" 
                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              
              <input required type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:border-gold-500 outline-none" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              
              <select className="w-full px-4 py-3 rounded-xl border border-borderLight focus:border-gold-500 outline-none"
                value={formData.channel} onChange={e => setFormData({...formData, channel: e.target.value})}>
                <option value="PHONE">Gọi điện thoại</option>
                <option value="ZALO">Nhắn tin Zalo</option>
                <option value="EMAIL">Qua Email</option>
              </select>

              <textarea required placeholder="Tình trạng da hoặc vấn đề cần tư vấn..." rows="3" className="w-full px-4 py-3 rounded-xl border border-borderLight focus:border-gold-500 outline-none"
                value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
              
              {status && <p className="text-sm font-medium text-gold-600">{status}</p>}

              <button type="submit" className="w-full py-3 bg-gold-500 text-white rounded-xl font-medium hover:bg-gold-600 transition">
                Gửi yêu cầu
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
