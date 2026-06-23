import React from 'react';

const AboutSection = () => {
  const values = [
    { title: 'Personalized Care', desc: 'Mỗi khách hàng là một cá nhân với làn da và nhu cầu riêng biệt. Chúng tôi thiết kế liệu trình dành riêng cho bạn.' },
    { title: 'Professional Technicians', desc: 'Đội ngũ chuyên viên giàu kinh nghiệm, được đào tạo bài bản và luôn cập nhật công nghệ làm đẹp mới nhất.' },
    { title: 'Premium Experience', desc: 'Không gian thư giãn đẳng cấp, âm nhạc êm dịu, hương thơm thảo mộc tự nhiên mang lại sự thoải mái tuyệt đối.' }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2070&auto=format&fit=crop" alt="Spa Interior" className="rounded-[2rem] shadow-2xl relative z-10" />
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold-500 rounded-[2rem] -z-0"></div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="text-gold-500 font-medium tracking-wider uppercase text-sm">Về Chúng Tôi</span>
            <h2 className="text-4xl font-serif font-bold text-dark mt-3 mb-6">Đẳng Cấp Làm Đẹp Không Gian Thư Giãn Tuyệt Đối</h2>
            <p className="text-grayText mb-10 leading-relaxed">
              Chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự tự tin và một tinh thần thoải mái. Với sứ mệnh mang lại trải nghiệm làm đẹp cao cấp, Spa CRM không ngừng cải tiến dịch vụ và nâng cao tay nghề đội ngũ.
            </p>
            
            <div className="space-y-6">
              {values.map((v, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-ivory text-gold-500 rounded-full flex items-center justify-center flex-shrink-0 border border-borderLight">
                    <span className="font-serif font-bold italic">{i+1}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-dark mb-1">{v.title}</h4>
                    <p className="text-grayText text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
