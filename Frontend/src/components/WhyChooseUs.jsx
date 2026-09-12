import React from 'react';
import { UserCheck, Cpu, ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
  const points = [
    {
      icon: <UserCheck size={26} />,
      title: 'Senior Specialist Doctors',
      desc: 'Treatments led by qualified Masters in Physiotherapy (MPT) with 15+ years of clinical excellence.'
    },
    {
      icon: <Cpu size={26} />,
      title: 'Class IV Laser & Decompression',
      desc: 'Equipped with state-of-the-art electrotherapy and spinal decompression technology.'
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'Zero Shared Sessions',
      desc: 'You receive exclusive 1-on-1 focus. We never double-book or rush through your therapy.'
    },
    {
      icon: <Clock size={26} />,
      title: 'Punctual Appointments',
      desc: 'Respecting your busy schedule with zero waiting time upon arrival.'
    },
    {
      icon: <Award size={26} />,
      title: 'Measurable Progress Tracking',
      desc: 'Digital range-of-motion assessments to monitor your recovery milestone by milestone.'
    },
    {
      icon: <Sparkles size={26} />,
      title: 'Modern Clinic Ambience',
      desc: 'Private, air-conditioned therapy suites designed for peaceful, restful recovery.'
    }
  ];

  return (
    <section className="why-section section-padding" id="why-us">
      <div className="container">
        
        <div className="section-header-light">
          <span className="section-tag-teal">WHY SATYA</span>
          <h2 className="section-title-dark">
            What Makes Us <span className="serif-italic-teal">Different</span>
          </h2>
          <p className="section-subtitle-dark">
            We focus on genuine, long-term healing — so you stay active and pain-free for life.
          </p>
        </div>

        <div className="why-grid">
          {points.map((pt, idx) => (
            <div className="light-card why-card" key={idx}>
              <div className="card-icon-teal">{pt.icon}</div>
              <h3>{pt.title}</h3>
              <p>{pt.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
