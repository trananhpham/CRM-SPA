import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full Width Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-105"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-dark/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Luxury Spa <br/> & Beauty Care
          </h1>
          <p className="text-lg text-ivory mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Chăm sóc sắc đẹp chuyên nghiệp, đặt lịch dễ dàng, trải nghiệm dịch vụ cao cấp. Đánh thức vẻ đẹp tự nhiên của bạn trong không gian thư giãn tuyệt đối.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a href="#booking" className="px-8 py-4 bg-gold-500 text-white rounded-full font-medium text-lg hover:bg-gold-600 transition shadow-lg shadow-gold-500/50">
              Đặt lịch ngay
            </a>
            <a href="#services" className="px-8 py-4 bg-transparent border-2 border-gold-500 text-gold-500 rounded-full font-medium text-lg hover:bg-gold-500 hover:text-white transition backdrop-blur-sm">
              Xem dịch vụ
            </a>
          </div>
          
          <div className="flex justify-center gap-12 border-t border-gold-500/30 pt-8">
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-gold-500 drop-shadow-md">500+</p>
              <p className="text-gray-300 text-sm mt-2 uppercase tracking-widest font-medium">Khách hàng</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-gold-500 drop-shadow-md">20+</p>
              <p className="text-gray-300 text-sm mt-2 uppercase tracking-widest font-medium">Dịch vụ</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-gold-500 drop-shadow-md">98%</p>
              <p className="text-gray-300 text-sm mt-2 uppercase tracking-widest font-medium">Hài lòng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
