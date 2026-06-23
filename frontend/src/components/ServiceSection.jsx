import React, { useState, useEffect } from 'react';
import { getServices } from '../services/publicApi';

const ServiceSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(setServices).catch(console.error);
  }, []);

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-500 font-medium tracking-wider uppercase text-sm">Dịch Vụ Của Chúng Tôi</span>
          <h2 className="text-4xl font-serif font-bold text-dark mt-3">Đánh Thức Vẻ Đẹp Của Bạn</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service.service_id} className="bg-white border border-borderLight rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 group overflow-hidden flex flex-col">
              {service.image_url && (
                <div className="w-full h-48 mb-6 overflow-hidden rounded-xl bg-gray-100">
                  <img src={service.image_url} alt={service.service_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="text-sm text-grayText mb-3">{service.category_name}</div>
              <h3 className="text-xl font-serif font-bold text-dark mb-4 group-hover:text-gold-500 transition-colors">{service.service_name}</h3>
              <p className="text-grayText mb-6 line-clamp-3">{service.description}</p>
              <div className="flex justify-between items-center mt-auto pt-6 border-t border-borderLight">
                <div>
                  <span className="text-2xl font-bold text-dark">{Number(service.price).toLocaleString()}</span>
                  <span className="text-sm text-grayText"> VNĐ</span>
                </div>
                <div className="text-sm text-grayText bg-ivory px-3 py-1 rounded-full">{service.duration_minutes} phút</div>
              </div>
              <a href={`#booking`} className="block w-full text-center mt-6 py-3 border border-gold-500 text-gold-500 rounded-xl font-medium hover:bg-gold-50 transition">
                Đặt dịch vụ này
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
