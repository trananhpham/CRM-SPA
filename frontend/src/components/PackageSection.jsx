import React, { useState, useEffect } from 'react';
import { getPackages } from '../services/publicApi';

const PackageSection = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getPackages().then(setPackages).catch(console.error);
  }, []);

  return (
    <section id="packages" className="py-24 bg-ivory">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-500 font-medium tracking-wider uppercase text-sm">Gói Liệu Trình</span>
          <h2 className="text-4xl font-serif font-bold text-dark mt-3">Đầu Tư Xứng Đáng Cho Nhan Sắc</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {packages.map((pkg, index) => (
            <div key={pkg.package_id} className={`relative bg-white border ${index === 0 ? 'border-gold-500 shadow-xl shadow-gold-500/10' : 'border-borderLight'} rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300`}>
              {index === 0 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Popular
                </div>
              )}
              <h3 className="text-2xl font-serif font-bold text-dark mb-2 text-center">{pkg.package_name}</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gold-500">{Number(pkg.package_price).toLocaleString()}</span>
                <span className="text-grayText"> VNĐ</span>
              </div>
              <p className="text-grayText text-center mb-8 text-sm">{pkg.description}</p>
              
              <ul className="space-y-4 mb-8">
                {pkg.items && pkg.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-dark">{item.included_sessions} buổi {item.service_name}</span>
                  </li>
                ))}
                <li className="flex items-start">
                    <svg className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-dark">Hạn sử dụng: {pkg.validity_days} ngày</span>
                  </li>
              </ul>
              
              <a href="#booking" className={`block w-full text-center py-3 rounded-xl font-medium transition ${index === 0 ? 'bg-gold-500 text-white hover:bg-gold-600' : 'bg-ivory text-dark hover:bg-gold-50 hover:text-gold-500'}`}>
                Mua gói này
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
