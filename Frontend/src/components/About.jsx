import React from 'react';
import { Target, HeartHandshake, Zap, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <section className="about-section section-padding" id="about">
      <div className="container about-container">
        
        {/* Left Column */}
        <div className="about-left">
          <span className="section-tag-teal">OUR PHILOSOPHY</span>
          <h2 className="section-title-dark">
            Honest, Science-Backed <br />
            <span className="serif-italic-teal">Care That Lasts</span>
          </h2>
          <p className="about-lead-dark">
            At Satya Physiotherapy Center, we reject quick fixes and generic exercise sheets. We take the time to accurately diagnose the root cause of your pain.
          </p>
          <p className="about-desc-dark">
            Whether you are recovering from knee surgery, dealing with chronic back pain, or overcoming a sports injury, our clinical team works 1-on-1 with you through every phase of healing.
          </p>
        </div>

        {/* Right Column Grid (Light Cards) */}
        <div className="about-cards-grid">
          <div className="philosophy-card-light">
            <div className="p-icon-teal"><Target size={24} /></div>
            <h3>Biomechanical Diagnosis</h3>
            <p>In-depth posture, spinal, and movement analysis before treatment starts.</p>
          </div>

          <div className="philosophy-card-light">
            <div className="p-icon-teal"><HeartHandshake size={24} /></div>
            <h3>1-on-1 Dedicated Time</h3>
            <p>Every session is exclusively with your senior physiotherapist. No rushed appointments.</p>
          </div>

          <div className="philosophy-card-light">
            <div className="p-icon-teal"><Zap size={24} /></div>
            <h3>Class IV Laser & Electro Tech</h3>
            <p>Advanced non-invasive modalities to accelerate deep cellular tissue healing.</p>
          </div>

          <div className="philosophy-card-light">
            <div className="p-icon-teal"><ShieldCheck size={24} /></div>
            <h3>Relapse Prevention</h3>
            <p>Custom core, joint, and ergonomic conditioning so pain doesn't return.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
