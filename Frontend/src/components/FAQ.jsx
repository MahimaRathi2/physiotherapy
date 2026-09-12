import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openLeftIndex, setOpenLeftIndex] = useState(-1); // Both start closed for equal alignment
  const [openRightIndex, setOpenRightIndex] = useState(-1);

  const leftFaqs = [
    {
      question: 'How can I contact Satya Physiotherapy Center?',
      answer: 'You can contact us through the booking inquiry form on this page using your name, contact number, email, condition details, and preferred time slot, or call our helpline directly.'
    },
    {
      question: 'What conditions do you treat at the clinic?',
      answer: 'We treat back & neck pain, disc herniation, frozen shoulder, knee osteoarthritis, sports injuries (ACL, meniscus), stroke rehabilitation, facial palsy, and post-surgical rehab.'
    },
    {
      question: 'Do I need a doctor referral before booking an appointment?',
      answer: 'No referral is mandatory. You can book a direct consultation with our senior physiotherapists. Please bring any existing X-rays, MRIs, or medical prescriptions.'
    },
    {
      question: 'How long does each physical therapy session take?',
      answer: 'An initial comprehensive movement assessment takes approximately 45 to 60 minutes. Subsequent therapy sessions typically last 40 to 50 minutes.'
    },
    {
      question: 'Is physical therapy treatment painful?',
      answer: 'Our procedures are gentle and therapeutic. While mild stretching discomfort may occur during joint mobilization, our specialists strictly monitor pain thresholds for your comfort.'
    }
  ];

  const rightFaqs = [
    {
      question: 'What advanced technology is available at the clinic?',
      answer: 'We feature Class IV Laser Therapy, Shortwave Diathermy (SWD), Digital Ultrasound, IFT (Interferential Therapy), TENS, and Automated Cervical/Lumbar Traction.'
    },
    {
      question: 'Can physiotherapy help me avoid joint or disc surgery?',
      answer: 'Yes! In many cases of L4-L5 disc bulges, knee arthritis, and rotator cuff tears, targeted spinal decompression and core stabilization resolve pain without surgery.'
    },
    {
      question: 'What should I wear or bring to my first appointment?',
      answer: 'Please wear comfortable, flexible clothing (like sports shorts or sweatpants) allowing easy joint movement. Bring any relevant diagnostic reports (X-Ray, MRI).'
    },
    {
      question: 'Are home exercise programs provided alongside therapy?',
      answer: 'Yes! Every patient receives a customized home exercise guide featuring posture corrections and stretching drills to accelerate recovery between clinic visits.'
    },
    {
      question: 'How do you prevent pain relapses after treatment ends?',
      answer: 'Before discharge, we transition you through a stabilization phase focusing on joint strengthening, core stability, and ergonomic education to protect against future injuries.'
    }
  ];

  const toggleLeft = (index) => {
    setOpenLeftIndex(openLeftIndex === index ? -1 : index);
  };

  const toggleRight = (index) => {
    setOpenRightIndex(openRightIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section section-padding" id="faq">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-light">
          <span className="section-tag-teal">GOT QUESTIONS?</span>
          <h2 className="section-title-dark">
            Frequently Asked <span className="serif-italic-teal">Questions</span>
          </h2>
          <p className="section-subtitle-dark">
            Find answers to the most common questions about Satya Physiotherapy Center.
          </p>
        </div>

        {/* 2-Column Equal FAQ Layout */}
        <div className="faq-two-columns">
          
          {/* Left Column Stack */}
          <div className="faq-column-stack">
            {leftFaqs.map((faq, idx) => {
              const isOpen = openLeftIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`faq-card-modern ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleLeft(idx)}
                >
                  <div className="faq-header-row">
                    <h3 className="faq-question-text">{faq.question}</h3>
                    <div className="faq-arrow-wrap">
                      {isOpen ? (
                        <ChevronUp size={16} className="faq-arrow-active" />
                      ) : (
                        <ChevronDown size={16} className="faq-arrow-muted" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="faq-body-content">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column Stack */}
          <div className="faq-column-stack">
            {rightFaqs.map((faq, idx) => {
              const isOpen = openRightIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`faq-card-modern ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleRight(idx)}
                >
                  <div className="faq-header-row">
                    <h3 className="faq-question-text">{faq.question}</h3>
                    <div className="faq-arrow-wrap">
                      {isOpen ? (
                        <ChevronUp size={16} className="faq-arrow-active" />
                      ) : (
                        <ChevronDown size={16} className="faq-arrow-muted" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="faq-body-content">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FAQ;
