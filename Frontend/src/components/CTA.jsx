import React from 'react';
import { PhoneCall, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';

const CTA = () => {
  return (
    <section className="cta-section section-padding" id="cta">
      <div className="container">
        
        <div className="cta-box-light">
          <div className="cta-header">
            <span className="section-tag-teal">TAKE THE FIRST STEP</span>
            <h2 className="cta-headline-dark">
              Ready To Move <span className="serif-italic-teal">Without Pain?</span>
            </h2>
            <p className="cta-sub-dark">
              Book your initial consultation and comprehensive movement assessment with our specialist team today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="cta-buttons-row">
            <a href="tel:+917500831828" className="btn btn-teal cta-btn-main">
              <span>Call to Book</span>
              <PhoneCall size={18} />
            </a>
            <a 
              href="#cta" 
              className="btn btn-outline-dark cta-btn-sec"
            >
              <span>Get Directions</span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          {/* Quick Contact Info Strip */}
          <div className="cta-info-grid-light">
            <div className="info-block-dark">
              <PhoneCall size={20} className="info-icon-teal" />
              <div>
                <strong>Helpline</strong>
                <p>+91 7500831828</p>
              </div>
            </div>

            <div className="info-block-dark">
              <Clock size={20} className="info-icon-teal" />
              <div>
                <strong>Clinic Hours</strong>
                <p>Mon–Sat: 8 AM – 8 PM · Sun: 9 AM – 1 PM</p>
              </div>
            </div>

            <div className="info-block-dark">
              <ShieldCheck size={20} className="info-icon-teal" />
              <div>
                <strong>Appointments</strong>
                <p>Prior Appointment Recommended</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;
