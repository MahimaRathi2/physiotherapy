import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, 
  MessageSquare, Navigation, Car, Train, 
  Accessibility, AlertCircle, ChevronDown, ChevronUp, 
  ExternalLink, User, PhoneCall, HelpCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import FAQ from './FAQ.jsx';
import '../styles/contact.css';

const ContactSection = ({ showHeroBanner = true, showFaq = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    condition: 'Lower Back / Sciatica Pain',
    preferredTime: 'Morning (9 AM - 12 PM)',
    preferredDate: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setSubmitError('Please enter your full name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        condition: `${formData.condition}${formData.message ? ` - Note: ${formData.message}` : ''}`,
        preferredTime: formData.preferredTime,
        preferredDate: formData.preferredDate
      };

      const res = await api.submitInquiry(payload);
      if (res.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          condition: 'Lower Back / Sciatica Pain',
          preferredTime: 'Morning (9 AM - 12 PM)',
          preferredDate: '',
          message: ''
        });
      } else {
        setSubmitError(res.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit form. Please call our helpline directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactFaqs = [
    {
      q: "Do I need a doctor's referral to visit Satya Physiotherapy Center?",
      a: "No, a doctor's referral is not mandatory. You can book an assessment directly with our senior physiotherapists. However, if you have existing X-rays, MRI scans, or medical reports, please bring them along."
    },
    {
      q: "How early should I arrive for my first appointment?",
      a: "We recommend arriving 10-15 minutes before your scheduled appointment time to complete initial registration and health questionnaire forms."
    },
    {
      q: "Is parking available at the center?",
      a: "Yes! Free dedicated patient parking is available directly behind our center with wheelchair accessible entry."
    },
    {
      q: "What should I wear for my physical therapy assessment?",
      a: "Wear comfortable, loose-fitting athletic clothing (e.g. t-shirt, shorts or track pants) that allows our therapists to easily examine joint movement."
    },
    {
      q: "How do I cancel or reschedule an appointment?",
      a: "You can call our helpline at +91 7500831828 or manage your appointments directly through your Patient Dashboard."
    }
  ];

  return (
    <div className="contact-section-wrapper" id="contact">
      {/* --- OPTIONAL HERO BANNER --- */}
      {showHeroBanner && (
        <section className="contact-hero">
          <div className="hero-ambient-glow glow-1"></div>
          <div className="hero-ambient-glow glow-2"></div>
          <div className="container relative-z">
            <div className="contact-hero-content animate-fade-in-up">
              <span className="contact-hero-tag tag-pulse">
                <MessageSquare size={14} /> CONNECTED CARE · 24/7 SUPPORT
              </span>
              <h1 className="contact-hero-title">
                We Are Here To Help You <br />
                <span className="serif-italic-teal glow-shimmer">Recover & Thrive</span>
              </h1>
              <p className="contact-hero-sub">
                Have questions about your condition, treatment options, or booking? Reach out to our specialist team for fast, friendly assistance.
              </p>

              <div className="contact-quick-badges">
                <div className="quick-badge-item animated-float-1">
                  <Clock size={16} color="#00b493" />
                  <span>15-Min Fast Response</span>
                </div>
                <div className="quick-badge-item animated-float-2">
                  <MapPin size={16} color="#00b493" />
                  <span>Prime Location & Free Parking</span>
                </div>
                <div className="quick-badge-item animated-float-3">
                  <PhoneCall size={16} color="#00b493" />
                  <span>Direct Helpline Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- MAIN CONTACT SECTION (2-COLUMNS) --- */}
      <section className="contact-main-section section-padding">
        <div className="container">
          <div className="contact-unified-card">
            <div className="contact-grid-layout">

            {/* --- LEFT COLUMN: DIRECT CONTACT CHANNELS --- */}
            <div className="contact-info-column">
              <div className="contact-section-header">
                <span className="section-tag-teal">REACH US DIRECTLY</span>
                <h2 className="contact-col-title">Multiple Ways To Connect</h2>
                <p className="contact-col-desc">
                  Choose your preferred channel below or visit our clinic for an in-person assessment.
                </p>
              </div>

              <div className="contact-cards-stack">
                {/* Phone Call Card */}
                <div className="contact-channel-card highlight-card">
                  <div className="channel-icon-box teal-bg">
                    <Phone size={22} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-label">HELPLINE & APPOINTMENTS</span>
                    <a href="tel:+917500831828" className="channel-value-link">+91 7500831828</a>
                    <p className="channel-hint">Instant phone assistance (Mon–Sat 8 AM–8 PM)</p>
                  </div>
                  <a href="tel:+917500831828" className="btn btn-teal btn-sm action-btn">
                    <span>Call Now</span>
                    <PhoneCall size={14} />
                  </a>
                </div>



                {/* Email Support Card */}
                <div className="contact-channel-card">
                  <div className="channel-icon-box dark-bg">
                    <Mail size={22} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-label">EMAIL DESK</span>
                    <a href="mailto:contact@satyaphysio.com" className="channel-value-link">contact@satyaphysio.com</a>
                    <p className="channel-hint">For inquiries, medical reports & feedback</p>
                  </div>
                </div>

                {/* Clinic Address Card */}
                <div className="contact-channel-card">
                  <div className="channel-icon-box teal-bg">
                    <MapPin size={22} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-label">CLINIC LOCATION</span>
                    <strong className="address-title">Satya Physiotherapy Center</strong>
                    <p className="address-text">Main Road, Sector 14, New Delhi - 110001</p>
                    <span className="landmark-text">📍 Landmark: 200m from Sector 14 Metro Station</span>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Satya+Physiotherapy+Center" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-dark btn-sm action-btn"
                  >
                    <span>Maps</span>
                    <Navigation size={14} />
                  </a>
                </div>

                {/* Working Hours Card */}
                <div className="contact-hours-card">
                  <div className="hours-card-header">
                    <Clock size={20} color="#00b493" />
                    <h3>Clinic Operating Hours</h3>
                  </div>
                  <div className="hours-list">
                    <div className="hours-row">
                      <span>Monday – Saturday:</span>
                      <strong>8:00 AM – 8:00 PM</strong>
                    </div>
                    <div className="hours-row">
                      <span>Sunday:</span>
                      <strong>9:00 AM – 1:00 PM</strong>
                    </div>
                    <div className="hours-row emergency-row">
                      <span>Emergency Care:</span>
                      <strong className="teal-text">Prior Appointment Recommended</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: INTERACTIVE INQUIRY & BOOKING FORM --- */}
            <div className="contact-form-column">
              <div className="contact-form-card">
                <div className="form-card-header">
                  <span className="form-tag">SEND AN INQUIRY</span>
                  <h2>Request A Callback / Appointment</h2>
                  <p>Fill out your details below and our team will get in touch with you within 30 minutes.</p>
                </div>

                {submitSuccess ? (
                  <div className="contact-success-box">
                    <CheckCircle2 size={54} color="#00b493" />
                    <h3>Inquiry Submitted Successfully!</h3>
                    <p>
                      Thank you for reaching out to Satya Physiotherapy Center. Our clinic care team will call you at <strong>{formData.phone || 'your phone number'}</strong> shortly to confirm your consultation time.
                    </p>
                    <button 
                      type="button" 
                      className="btn btn-teal mt-4" 
                      onClick={() => setSubmitSuccess(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    {submitError && (
                      <div className="contact-error-alert">
                        <AlertCircle size={18} />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="form-grid-two">
                      <div className="form-group">
                        <label htmlFor="contact-name">Full Name <span className="req">*</span></label>
                        <div className="input-with-icon">
                          <User size={18} className="input-icon" />
                          <input 
                            type="text" 
                            id="contact-name"
                            name="name"
                            placeholder="e.g. Rahul Sharma" 
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="contact-phone">Phone Number <span className="req">*</span></label>
                        <div className="input-with-icon">
                          <Phone size={18} className="input-icon" />
                          <input 
                            type="tel" 
                            id="contact-phone"
                            name="phone"
                            placeholder="+91 98765 43210" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-grid-two">
                      <div className="form-group">
                        <label htmlFor="contact-email">Email Address (Optional)</label>
                        <div className="input-with-icon">
                          <Mail size={18} className="input-icon" />
                          <input 
                            type="email" 
                            id="contact-email"
                            name="email"
                            placeholder="name@example.com" 
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="contact-condition">Condition / Care Needed</label>
                        <select 
                          id="contact-condition"
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                        >
                          <option value="Lower Back / Sciatica Pain">Lower Back / Sciatica Pain</option>
                          <option value="Knee Pain & Ligament Rehab">Knee Pain & Ligament Rehab</option>
                          <option value="Neck, Shoulder & Cervical">Neck, Shoulder & Cervical</option>
                          <option value="Post-Surgical Decompression">Post-Surgical Decompression</option>
                          <option value="Paralysis & Neuro Rehab">Paralysis & Neuro Rehab</option>
                          <option value="Sports Injury Recovery">Sports Injury Recovery</option>
                          <option value="General Consultation / Other">General Consultation / Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-two">
                      <div className="form-group">
                        <label htmlFor="contact-preferredDate">Preferred Date</label>
                        <input 
                          type="date" 
                          id="contact-preferredDate"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="contact-preferredTime">Preferred Time Slot</label>
                        <select 
                          id="contact-preferredTime"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                        >
                          <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                          <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                          <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-message">Describe Your Symptoms or Message</label>
                      <textarea 
                        id="contact-message"
                        name="message"
                        rows="4"
                        placeholder="Please brief us on your pain, symptoms, or any specific questions..."
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-teal form-submit-btn" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry & Call Request</span>
                          <Send size={18} />
                        </>
                      )}
                    </button>

                    <p className="form-disclaimer">
                      🔒 Your privacy is 100% protected. We never share your personal health information.
                    </p>
                  </form>
                )}
              </div>
            </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION (10 FAQs: 5 Left, 5 Right) --- */}
      {showFaq && <FAQ />}
    </div>
  );
};

export default ContactSection;
