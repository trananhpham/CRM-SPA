import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold text-dark tracking-wide">
          Spa CRM<span className="text-gold-500">.</span>
        </Link>
        <nav className="hidden md:flex space-x-8 text-grayText font-medium">
          <a href="#home" className="hover:text-gold-500 transition">Home</a>
          <a href="#services" className="hover:text-gold-500 transition">Services</a>
          <a href="#packages" className="hover:text-gold-500 transition">Packages</a>
          <a href="#about" className="hover:text-gold-500 transition">About</a>
          <a href="#contact" className="hover:text-gold-500 transition">Contact</a>
        </nav>
        <div className="flex items-center space-x-4">
          <a href="#booking" className="hidden md:block px-6 py-2 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600 transition shadow-sm">
            Book Now
          </a>
          <Link to="/login" className="px-6 py-2 border border-gold-500 text-gold-500 rounded-full font-medium hover:bg-gold-50 transition">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
