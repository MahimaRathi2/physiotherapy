import React from 'react';
import Header from '../components/common/Header.jsx';
import WhyChooseUs from '../components/WhyChooseUs.jsx';
import Footer from '../components/common/Footer.jsx';

const WhySatyaPage = () => {
  return (
    <div className="why-satya-page">
      <Header />
      
      {/* Why Satya Hero Banner */}
      <section className="about-hero-section">
        <div className="hero-ambient-glow glow-1"></div>
        <div className="hero-ambient-glow glow-2"></div>
        <div className="container relative-z">
          <div className="about-hero-content animate-fade-in-up">
            <span className="section-tag-teal tag-pulse">THE SATYA ADVANTAGE</span>
            <h1 className="about-hero-title">
              Why Patients Trust <br />
              <span className="serif-italic-teal glow-shimmer">Satya Physiotherapy Center</span>
            </h1>
            <p className="about-hero-sub">
              We combine senior MPT doctor expertise, Class IV laser technology, zero wait times, and exclusive 1-on-1 sessions to ensure lasting recovery.
            </p>

            <div className="contact-quick-badges about-hero-badges">
              <div className="quick-badge-item animated-float-1">
                <span>🏆 Master's (MPT) Doctors</span>
              </div>
              <div className="quick-badge-item animated-float-2">
                <span>⏱️ Zero Wait Appointments</span>
              </div>
              <div className="quick-badge-item animated-float-3">
                <span>🤝 Dedicated 1-on-1 Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Pillars */}
      <WhyChooseUs />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WhySatyaPage;
