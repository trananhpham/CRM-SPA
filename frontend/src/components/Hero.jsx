import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-ivory">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 z-10">
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-dark leading-tight mb-6">
            Luxury Spa <br/> & Beauty Care
          </h1>
          <p className="text-lg text-grayText mb-10 max-w-lg leading-relaxed">
            Chăm sóc sắc đẹp chuyên nghiệp, đặt lịch dễ dàng, trải nghiệm dịch vụ cao cấp. Đánh thức vẻ đẹp tự nhiên của bạn trong không gian thư giãn tuyệt đối.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#booking" className="px-8 py-4 bg-gold-500 text-white rounded-full font-medium text-lg hover:bg-gold-600 transition shadow-lg shadow-gold-500/30">
              Đặt lịch ngay
            </a>
            <a href="#services" className="px-8 py-4 bg-white border-2 border-gold-500 text-gold-500 rounded-full font-medium text-lg hover:bg-gold-50 transition">
              Xem dịch vụ
            </a>
          </div>
          <div className="flex gap-8 border-t border-borderLight pt-8">
            <div>
              <p className="text-3xl font-serif font-bold text-dark">500+</p>
              <p className="text-grayText text-sm mt-1">Khách hàng</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-dark">20+</p>
              <p className="text-grayText text-sm mt-1">Dịch vụ</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-dark">98%</p>
              <p className="text-grayText text-sm mt-1">Hài lòng</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative">
          {/* Thay ảnh bằng khối màu nếu không có ảnh */}
          <div className="w-full aspect-[4/5] bg-borderLight rounded-[2rem] overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent mix-blend-overlay"></div>
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop" alt="Spa Treatment" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
