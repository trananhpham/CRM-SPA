import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">Spa CRM<span className="text-gold-500">.</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trải nghiệm dịch vụ làm đẹp và chăm sóc sức khỏe đẳng cấp. Nơi vẻ đẹp tự nhiên của bạn được tôn vinh và tỏa sáng.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-gold-500">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>123 Đường Sắc Đẹp, Q.1, TP.HCM</li>
              <li>Hotline: 1900 8888 66</li>
              <li>Email: contact@spacrm.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-gold-500">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-gold-500 transition">Dịch vụ</a></li>
              <li><a href="#packages" className="hover:text-gold-500 transition">Liệu trình</a></li>
              <li><a href="#about" className="hover:text-gold-500 transition">Về chúng tôi</a></li>
              <li><a href="#booking" className="hover:text-gold-500 transition">Đặt lịch</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-gold-500">Giờ hoạt động</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between"><span>Thứ 2 - Thứ 6:</span> <span>09:00 - 20:00</span></li>
              <li className="flex justify-between"><span>Thứ 7 - CN:</span> <span>08:00 - 21:00</span></li>
            </ul>
          </div>
          
        </div>
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Spa CRM. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
