import React from 'react';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
import ContactSection from '../components/ContactSection.jsx';

const ContactPage = () => {
  return (
    <div className="contact-page-redesigned">
      <Header />
      <ContactSection showHeroBanner={true} />
      <Footer />
    </div>
  );
};

export default ContactPage;
