import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServiceSection from '../components/ServiceSection';
import PackageSection from '../components/PackageSection';
import AboutSection from '../components/AboutSection';
import Testimonials from '../components/Testimonials';
import BookingForm from '../components/BookingForm';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Chatbox from '../components/Chatbox';

const HomePage = () => {
  return (
    <div className="font-sans text-dark bg-ivory overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <ServiceSection />
        <PackageSection />
        <AboutSection />
        <BookingForm />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <Chatbox />
    </div>
  );
};

export default HomePage;
