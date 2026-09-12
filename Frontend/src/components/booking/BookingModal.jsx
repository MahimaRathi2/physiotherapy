import React, { useState, useEffect } from 'react';
import { X, MapPin, Video, Home, Calendar, Clock, User, Phone, Mail, FileText, Upload, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookingModal = ({ isOpen, onClose, initialType = 'in-person', preselectedDoctor = null }) => {
  const { user } = useAuth();
  const [bookingType, setBookingType] = useState(initialType); // 'in-person', 'online', 'home'
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  // In-Person Form State
  const [inPersonData, setInPersonData] = useState({
    patientName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    service: 'Orthopedic Rehabilitation',
    specialist: preselectedDoctor ? preselectedDoctor.name : 'Dr. Satya Prakash',
    date: '',
    timeSlot: '10:00 AM',
    notes: ''
  });

  // Home Physiotherapy Form State
  const [homeData, setHomeData] = useState({
    patientName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    service: 'Orthopedic Rehabilitation',
    specialist: preselectedDoctor ? preselectedDoctor.name : 'Dr. Satya Prakash',
    date: '',
    timeSlot: '10:00 AM',
    homeAddress: '',
    cityArea: '',
    notes: ''
  });

  // Online Consultation Form State
  const [onlineData, setOnlineData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    condition: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    additionalInfo: '',
    physiotherapistId: preselectedDoctor ? preselectedDoctor._id : ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setBookingType(initialType);
      if (preselectedDoctor) {
        setInPersonData((prev) => ({ ...prev, specialist: preselectedDoctor.name }));
        setHomeData((prev) => ({ ...prev, specialist: preselectedDoctor.name }));
        setOnlineData((prev) => ({ ...prev, physiotherapistId: preselectedDoctor._id }));
      }
      loadInitialData();
    }
  }, [isOpen, initialType, preselectedDoctor]);

  useEffect(() => {
    if (user) {
      setInPersonData((prev) => ({ ...prev, patientName: user.name, phone: user.phone, email: user.email }));
      setHomeData((prev) => ({ ...prev, patientName: user.name, phone: user.phone, email: user.email, homeAddress: prev.homeAddress || user.address || '' }));
      setOnlineData((prev) => ({ ...prev, name: user.name, phone: user.phone, email: user.email }));
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [docsRes, servsRes] = await Promise.all([api.getDoctors(), api.getServices()]);
      setDoctors(docsRes.data || []);
      setServices(servsRes.data || []);
    } catch (err) {
      console.error("Failed to load doctors or services:", err);
    }
  };

  if (!isOpen) return null;

  const handleInPersonSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!inPersonData.patientName || !inPersonData.phone || !inPersonData.date) {
        throw new Error('Please fill in required fields: Patient Name, Phone, and Date');
      }

      const res = await api.createAppointment({
        ...inPersonData,
        appointmentType: 'clinic'
      });
      setConfirmation({
        type: 'in-person',
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        data: res.data
      });
    } catch (err) {
      setError(err.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!homeData.patientName || !homeData.phone || !homeData.date || !homeData.homeAddress || !homeData.cityArea) {
        throw new Error('Please fill in required fields: Patient Name, Phone, Date, Home Address, and City / Area');
      }

      const res = await api.createAppointment({
        ...homeData,
        appointmentType: 'home'
      });

      setConfirmation({
        type: 'home',
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        data: res.data
      });
    } catch (err) {
      setError(err.message || 'Failed to schedule home physiotherapy visit');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlineSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!onlineData.name || !onlineData.phone || !onlineData.condition || !onlineData.preferredDate) {
        throw new Error('Please fill in required fields: Name, Phone, Condition, and Preferred Date');
      }

      const formData = new FormData();
      formData.append('name', onlineData.name);
      formData.append('phone', onlineData.phone);
      formData.append('email', onlineData.email);
      formData.append('condition', onlineData.condition);
      formData.append('preferredDate', onlineData.preferredDate);
      formData.append('preferredTime', onlineData.preferredTime);
      formData.append('additionalInfo', onlineData.additionalInfo);
      if (onlineData.physiotherapistId) {
        formData.append('physiotherapistId', onlineData.physiotherapistId);
      }
      if (selectedFile) {
        formData.append('reportFile', selectedFile);
      }

      const res = await api.createOnlineConsultation(formData);
      setConfirmation({
        type: 'online',
        id: `ONL-${Math.floor(1000 + Math.random() * 9000)}`,
        data: res.data
      });
    } catch (err) {
      setError(err.message || 'Failed to submit online consultation request');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setConfirmation(null);
    setError('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={resetAndClose}>
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="booking-modal-header">
          <div>
            <span className="section-tag-teal" style={{ fontSize: '0.75rem' }}>SATYA PHYSIOTHERAPY</span>
            <h2>Appointment & Consultation Desk</h2>
          </div>
          <button className="modal-close-btn" onClick={resetAndClose}>
            <X size={20} />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmation ? (
          <div className="booking-confirmation-view">
            <div className="conf-icon-wrap">
              <CheckCircle2 size={48} className="conf-icon" />
            </div>
            <h3>
              {confirmation.type === 'home'
                ? 'Home Physiotherapy Visit Scheduled!'
                : confirmation.type === 'in-person'
                ? 'In-Person Visit Scheduled!'
                : 'Online Consultation Request Received!'}
            </h3>
            <div className="ticket-badge">Reference ID: <strong>{confirmation.id}</strong></div>
            
            <div className="conf-desc" style={{ textAlign: 'left', margin: '1rem 0' }}>
              {confirmation.type === 'home' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <div><strong>Appointment Type:</strong> Home Physiotherapy (Physiotherapist Visits Home)</div>
                  <div><strong>Physiotherapist:</strong> {confirmation.data.specialist}</div>
                  <div><strong>Treatment Service:</strong> {confirmation.data.service}</div>
                  <div><strong>Scheduled Date & Time:</strong> {confirmation.data.date} at {confirmation.data.timeSlot}</div>
                  <div><strong>Patient Name:</strong> {confirmation.data.patientName}</div>
                  <div><strong>Home Visit Address:</strong> {confirmation.data.homeAddress}, {confirmation.data.cityArea}</div>
                  <div><strong>Payment Status:</strong> Offline (Pending)</div>
                </div>
              ) : confirmation.type === 'in-person' ? (
                <p>Your appointment for <strong>{confirmation.data.date}</strong> at <strong>{confirmation.data.timeSlot}</strong> with <strong>{confirmation.data.specialist}</strong> has been successfully registered.</p>
              ) : (
                <p>Our clinical team will review your submitted symptoms and medical reports for <strong>{confirmation.data.preferredDate} ({confirmation.data.preferredTime})</strong> and contact your phone number <strong>{confirmation.data.phone}</strong> shortly.</p>
              )}
            </div>

            <div className="conf-footer-btn">
              <button className="btn btn-teal" onClick={resetAndClose}>
                Done & Return
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Selected Service Indicator */}
            <div className="booking-selected-service-banner">
              {bookingType === 'in-person' && (
                <div className="selected-service-badge">
                  <MapPin size={20} className="service-icon" />
                  <div>
                    <strong>In-Person Clinic Visit</strong>
                    <span>1-on-1 Physical Assessment</span>
                  </div>
                </div>
              )}
              {bookingType === 'home' && (
                <div className="selected-service-badge">
                  <Home size={20} className="service-icon" />
                  <div>
                    <strong>Home Physiotherapy</strong>
                    <span>Physiotherapist Visits Your Home</span>
                  </div>
                </div>
              )}
              {bookingType === 'online' && (
                <div className="selected-service-badge">
                  <Video size={20} className="service-icon" />
                  <div>
                    <strong>Online Consultation Request</strong>
                    <span>Form & Medical Report Review</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="auth-alert alert-error" style={{ margin: '1rem 1.5rem 0' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: IN-PERSON APPOINTMENT FORM */}
            {bookingType === 'in-person' && (
              <form onSubmit={handleInPersonSubmit} className="booking-form-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={inPersonData.patientName}
                      onChange={(e) => setInPersonData({ ...inPersonData, patientName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inPersonData.phone}
                      onChange={(e) => setInPersonData({ ...inPersonData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Treatment Service</label>
                    <select
                      value={inPersonData.service}
                      onChange={(e) => setInPersonData({ ...inPersonData, service: e.target.value })}
                    >
                      {services.map((s) => (
                        <option key={s._id || s.title} value={s.title}>{s.title}</option>
                      ))}
                      {services.length === 0 && (
                        <>
                          <option value="Orthopedic Rehabilitation">Orthopedic Rehabilitation</option>
                          <option value="Sports Injury & Performance">Sports Injury & Performance</option>
                          <option value="Neurological Recovery">Neurological Recovery</option>
                          <option value="Class IV Laser & Pain Relief">Class IV Laser & Pain Relief</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Assigned Specialist</label>
                    <select
                      value={inPersonData.specialist}
                      onChange={(e) => setInPersonData({ ...inPersonData, specialist: e.target.value })}
                    >
                      {doctors.map((d) => (
                        <option key={d._id || d.name} value={d.name}>{d.name} ({d.title})</option>
                      ))}
                      {doctors.length === 0 && (
                        <>
                          <option value="Dr. Satya Prakash">Dr. Satya Prakash</option>
                          <option value="Dr. Neha Sharma">Dr. Neha Sharma</option>
                          <option value="Dr. Amit Varma">Dr. Amit Varma</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={inPersonData.date}
                      onChange={(e) => setInPersonData({ ...inPersonData, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Available Time Slot</label>
                    <select
                      value={inPersonData.timeSlot}
                      onChange={(e) => setInPersonData({ ...inPersonData, timeSlot: e.target.value })}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Symptoms / Clinical Notes</label>
                  <textarea
                    rows="2"
                    placeholder="Brief details about back/joint pain, surgery stage, or MRI report..."
                    value={inPersonData.notes}
                    onChange={(e) => setInPersonData({ ...inPersonData, notes: e.target.value })}
                  ></textarea>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn btn-outline-dark" onClick={resetAndClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-teal" disabled={loading}>
                    {loading ? 'Confirming...' : 'Confirm In-Person Visit'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: HOME PHYSIOTHERAPY FORM */}
            {bookingType === 'home' && (
              <form onSubmit={handleHomeSubmit} className="booking-form-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={homeData.patientName}
                      onChange={(e) => setHomeData({ ...homeData, patientName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={homeData.phone}
                      onChange={(e) => setHomeData({ ...homeData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Treatment Service *</label>
                    <select
                      value={homeData.service}
                      onChange={(e) => setHomeData({ ...homeData, service: e.target.value })}
                    >
                      {services.map((s) => (
                        <option key={s._id || s.title} value={s.title}>{s.title}</option>
                      ))}
                      {services.length === 0 && (
                        <>
                          <option value="Orthopedic Rehabilitation">Orthopedic Rehabilitation</option>
                          <option value="Sports Injury & Performance">Sports Injury & Performance</option>
                          <option value="Neurological Recovery">Neurological Recovery</option>
                          <option value="Class IV Laser & Pain Relief">Class IV Laser & Pain Relief</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Preferred Physiotherapist *</label>
                    <select
                      value={homeData.specialist}
                      onChange={(e) => setHomeData({ ...homeData, specialist: e.target.value })}
                    >
                      {doctors.map((d) => (
                        <option key={d._id || d.name} value={d.name}>{d.name} ({d.title})</option>
                      ))}
                      {doctors.length === 0 && (
                        <>
                          <option value="Dr. Satya Prakash">Dr. Satya Prakash</option>
                          <option value="Dr. Neha Sharma">Dr. Neha Sharma</option>
                          <option value="Dr. Amit Varma">Dr. Amit Varma</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={homeData.date}
                      onChange={(e) => setHomeData({ ...homeData, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Available Time Slot *</label>
                    <select
                      value={homeData.timeSlot}
                      onChange={(e) => setHomeData({ ...homeData, timeSlot: e.target.value })}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Home Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No., Street Name, Landmark"
                      value={homeData.homeAddress}
                      onChange={(e) => setHomeData({ ...homeData, homeAddress: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>City / Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sector 62, Noida"
                      value={homeData.cityArea}
                      onChange={(e) => setHomeData({ ...homeData, cityArea: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="Parking instructions, floor details, or specific symptoms..."
                    value={homeData.notes}
                    onChange={(e) => setHomeData({ ...homeData, notes: e.target.value })}
                  ></textarea>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn btn-outline-dark" onClick={resetAndClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-teal" disabled={loading}>
                    {loading ? 'Confirming...' : 'Confirm Home Visit Booking'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: ONLINE CONSULTATION REQUEST FORM */}
            {bookingType === 'online' && (
              <form onSubmit={handleOnlineSubmit} className="booking-form-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={onlineData.name}
                      onChange={(e) => setOnlineData({ ...onlineData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={onlineData.phone}
                      onChange={(e) => setOnlineData({ ...onlineData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={onlineData.email}
                      onChange={(e) => setOnlineData({ ...onlineData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Physiotherapist (Optional)</label>
                    <select
                      value={onlineData.physiotherapistId}
                      onChange={(e) => setOnlineData({ ...onlineData, physiotherapistId: e.target.value })}
                    >
                      <option value="">Any Senior Specialist</option>
                      {doctors.map((d) => (
                        <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Problem / Condition Description *</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Describe your symptoms, pain duration, or post-op recovery..."
                    value={onlineData.condition}
                    onChange={(e) => setOnlineData({ ...onlineData, condition: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={onlineData.preferredDate}
                      onChange={(e) => setOnlineData({ ...onlineData, preferredDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time *</label>
                    <select
                      value={onlineData.preferredTime}
                      onChange={(e) => setOnlineData({ ...onlineData, preferredTime: e.target.value })}
                    >
                      <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                      <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Upload Medical Reports (MRI, X-Ray, Prescription - Max 5MB)</label>
                  <div className="file-upload-box">
                    <Upload size={20} className="upload-icon-teal" />
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <span className="file-upload-text">
                      {selectedFile ? selectedFile.name : 'Choose file or drag here (.PDF, .PNG, .JPG)'}
                    </span>
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn btn-outline-dark" onClick={resetAndClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-teal" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Online Consultation Request'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
