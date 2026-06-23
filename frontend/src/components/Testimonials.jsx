import React, { useState, useEffect } from 'react';
import { getFeedbacks } from '../services/publicApi';

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    getFeedbacks().then(setFeedbacks).catch(console.error);
  }, []);

  if (feedbacks.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-500 font-medium tracking-wider uppercase text-sm">Đánh Giá</span>
          <h2 className="text-4xl font-serif font-bold text-dark mt-3">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {feedbacks.map((fb, idx) => (
            <div key={idx} className="bg-ivory p-8 rounded-2xl border border-borderLight relative">
              <div className="text-gold-500 mb-4 flex">
                {[...Array(fb.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-grayText italic mb-6">"{fb.comment}"</p>
              <div className="font-medium text-dark">- {fb.customer_name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
