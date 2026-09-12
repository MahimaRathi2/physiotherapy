import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, Phone, Mail, FileText, Bell, Lock, Home,
  Search, Plus, CheckCircle2, AlertCircle, X, ShieldCheck,
  Video, MapPin, LogOut, ArrowRight, RefreshCw, Check, Edit3, Award, Stethoscope, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/admin.css';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    qualification: 'MPT (Orthopedics)',
    experienceYears: 10,
    specialization: 'Spine & Joint Rehabilitation',
    servicesOffered: ['Orthopedic Rehabilitation', 'Sports Injury Care', 'Post-Operative Rehab', 'Spine Therapy', 'Home Physiotherapy'],
    consultationFee: '₹800',
    availableSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'],
    bio: 'Dedicated physical therapy specialist focused on non-surgical recovery and movement rehabilitation.'
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Reschedule Modal State
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    aptId: null,
    date: '',
    timeSlot: '10:00 AM'
  });

  // Cancel/Reject Modal State
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    aptId: null,
    reason: ''
  });

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [profRes, aptsRes, notifRes] = await Promise.all([
        api.getDoctorProfile().catch(() => ({ data: null })),
        api.getDoctorAppointments().catch(() => ({ data: [] })),
        api.getNotifications().catch(() => ({ data: [] }))
      ]);

      if (profRes.data) {
        setProfile(profRes.data);
      }
      setAppointments(aptsRes.data || []);
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.error("Failed to load doctor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, note = '') => {
    setStatusMsg({ type: '', text: '' });
    try {
      await api.updateAppointmentStatus(id, status, note);
      setStatusMsg({ type: 'success', text: `Appointment marked as ${status} successfully!` });
      loadDoctorData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleTogglePayment = async (id, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    setStatusMsg({ type: '', text: '' });
    try {
      await api.updatePaymentStatus(id, newStatus);
      setStatusMsg({ type: 'success', text: `Payment status updated to ${newStatus.toUpperCase()}` });
      loadDoctorData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update payment' });
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleModal.date || !rescheduleModal.timeSlot) return;
    setStatusMsg({ type: '', text: '' });
    try {
      await api.rescheduleDoctorAppointment(rescheduleModal.aptId, rescheduleModal.date, rescheduleModal.timeSlot);
      setStatusMsg({ type: 'success', text: 'Appointment rescheduled successfully!' });
      setRescheduleModal({ isOpen: false, aptId: null, date: '', timeSlot: '10:00 AM' });
      loadDoctorData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to reschedule' });
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModal.aptId) return;
    try {
      await handleUpdateStatus(cancelModal.aptId, 'cancelled', cancelModal.reason);
      setCancelModal({ isOpen: false, aptId: null, reason: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await api.updateDoctorProfile(profile);
      setProfile(res.data);
      setStatusMsg({ type: 'success', text: 'Clinical Credentials & Availability updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SP';
    const cleanName = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = cleanName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr || a.status === 'upcoming');
  const pendingRequests = appointments.filter(a => a.status === 'upcoming' && a.paymentStatus === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const filteredAppointments = appointments.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone.includes(searchTerm) ||
    a.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-dashboard-root">
      {/* Main Content Area */}
      <main className="patient-main-page">
        <div className="patient-dashboard-container">
          {/* Sidebar + Main Grid Layout - Identical to Patient Dashboard */}
          <div className="patient-portal-layout">
            {/* Sidebar Navigation */}
            <aside className="patient-sidebar">
              <nav className="sidebar-menu">
                {/* Doctor Profile Header Badge */}
                <div className="sidebar-user-card-header">
                  <div className="user-avatar-badge">
                    {getInitials(user?.name || profile.name || 'Satya Prakash')}
                  </div>
                  <div className="user-info-text">
                    <h3>Dr. {user?.name || profile.name || 'Satya Prakash'}</h3>
                    <p>{user?.email || 'doctor@satyaphyseo.com'}</p>
                    <span className="user-role-tag">PHYSIOTHERAPIST</span>
                  </div>
                </div>

                <div className="sidebar-section-title">SPECIALIST WORKSPACE</div>

                <button
                  className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="sidebar-link-icon"><Calendar size={18} /></span>
                  <span className="sidebar-link-text">Overview & Today</span>
                  {todayAppointments.length > 0 && <span className="sidebar-badge">{todayAppointments.length}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'requests' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requests')}
                >
                  <span className="sidebar-link-icon"><Clock size={18} /></span>
                  <span className="sidebar-link-text">Appointment Requests</span>
                  {pendingRequests.length > 0 && <span className="sidebar-badge badge-unread">{pendingRequests.length}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <span className="sidebar-link-icon"><User size={18} /></span>
                  <span className="sidebar-link-text">Patient History</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <span className="sidebar-link-icon"><Bell size={18} /></span>
                  <span className="sidebar-link-text">Notifications</span>
                  {unreadNotifs > 0 && <span className="sidebar-badge badge-unread">{unreadNotifs}</span>}
                </button>

                <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>CREDENTIALS & SETTINGS</div>

                <button
                  className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="sidebar-link-icon"><Award size={18} /></span>
                  <span className="sidebar-link-text">Profile & Availability</span>
                </button>

                <Link
                  to="/"
                  className="sidebar-link"
                  style={{ marginTop: '0.25rem' }}
                >
                  <span className="sidebar-link-icon"><ArrowRight size={18} /></span>
                  <span className="sidebar-link-text">Main Website</span>
                </Link>

                <button
                  className="sidebar-link sidebar-logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  <span className="sidebar-link-icon"><LogOut size={18} /></span>
                  <span className="sidebar-link-text">Sign Out</span>
                </button>
              </nav>

              <div className="sidebar-helpline-card">
                <div className="helpline-icon-wrap">
                  <Phone size={20} />
                </div>
                <div className="helpline-info">
                  <span className="helpline-label">Clinic Reception Desk</span>
                  <a href="tel:+917500831828" className="helpline-number">
                    +91 7500831828
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Panel Content (RIGHT SIDE) */}
            <div className="patient-content-area">
              {/* Welcome Hero Bar */}
              <div className="patient-hero-bar">
                <div className="patient-welcome">
                  <h1>
                    Welcome Back, <span className="serif-italic-teal">Dr. {user?.name || profile.name || 'Satya Prakash'}</span>
                  </h1>
                  <p>{profile.qualification} · {profile.specialization} · {profile.experienceYears} Years Clinical Exp.</p>
                </div>
              </div>

              {statusMsg.text && (
                <div className={`auth-alert ${statusMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} />
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* TAB 1: OVERVIEW & TODAY'S APPOINTMENTS */}
              {activeTab === 'overview' && (
                <div>
                  {/* KPI Quick Cards */}
                  <div className="patient-kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-teal">
                        <MapPin size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Upcoming / Today's Visits</div>
                        <div className="kpi-value">{todayAppointments.length}</div>
                        <div className="kpi-sub">Clinic & Home visits</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-orange">
                        <Clock size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Pending Confirmation</div>
                        <div className="kpi-value">{pendingRequests.length}</div>
                        <div className="kpi-sub">Awaiting doctor review</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-navy">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Completed Consultations</div>
                        <div className="kpi-value">{completedAppointments.length}</div>
                        <div className="kpi-sub">Total patient visits</div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule Panel */}
                  <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
                    <div className="admin-panel-header">
                      <h2 className="admin-panel-title">Active / Today's Scheduled Visits</h2>
                      <button className="btn btn-outline-dark doc-btn-sm" onClick={() => setActiveTab('requests')}>
                        Manage All Requests
                      </button>
                    </div>

                    {todayAppointments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Patient Details</th>
                              <th>Service & Type</th>
                              <th>Date & Time Slot</th>
                              <th>Venue / Address</th>
                              <th>Payment Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {todayAppointments.map((apt) => (
                              <tr key={apt._id}>
                                <td>
                                  <strong>{apt.patientName}</strong>
                                  <div className="table-sub-text"><Phone size={12} /> {apt.phone}</div>
                                  {apt.email && <div className="table-sub-text">{apt.email}</div>}
                                </td>
                                <td>
                                  <div>
                                    {apt.appointmentType === 'home' ? (
                                      <span className="status-badge status-home" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                        <Home size={12} /> Home Physio
                                      </span>
                                    ) : (
                                      <span className="status-badge status-upcoming" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                        <MapPin size={12} /> Clinic Visit
                                      </span>
                                    )}
                                  </div>
                                  <strong>{apt.service}</strong>
                                </td>
                                <td>
                                  <div><strong>{apt.date}</strong></div>
                                  <div className="table-sub-text"><Clock size={12} /> {apt.timeSlot}</div>
                                </td>
                                <td>
                                  {apt.appointmentType === 'home' ? (
                                    <div>
                                      <strong>{apt.homeAddress}</strong>
                                      <div className="table-sub-text">{apt.cityArea}</div>
                                    </div>
                                  ) : (
                                    <div className="table-sub-text">Satya Clinic Desk</div>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className={`status-badge ${apt.paymentStatus === 'paid' ? 'status-completed' : 'status-cancelled'}`}
                                    onClick={() => handleTogglePayment(apt._id, apt.paymentStatus)}
                                    title="Click to toggle payment status"
                                    style={{ cursor: 'pointer', border: 'none' }}
                                  >
                                    <DollarSign size={12} /> {apt.paymentStatus === 'paid' ? 'Paid (Offline/Online)' : 'Pending (Offline)'}
                                  </button>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <button
                                      className="btn btn-teal doc-btn-sm"
                                      onClick={() => handleUpdateStatus(apt._id, 'completed')}
                                    >
                                      <Check size={14} /> Complete
                                    </button>

                                    <button
                                      className="btn btn-outline-dark doc-btn-sm"
                                      onClick={() => setRescheduleModal({ isOpen: true, aptId: apt._id, date: apt.date, timeSlot: apt.timeSlot })}
                                    >
                                      <Edit3 size={14} /> Reschedule
                                    </button>

                                    <button
                                      className="action-btn-danger-text"
                                      onClick={() => setCancelModal({ isOpen: true, aptId: apt._id, reason: '' })}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-state-block">
                        <div className="empty-state-icon-wrap">
                          <Calendar size={32} />
                        </div>
                        <h3>No Active Appointments Today</h3>
                        <p>There are no clinic or home visits scheduled for today yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: APPOINTMENT REQUESTS & FULL MANAGEMENT */}
              {activeTab === 'requests' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">All Patient Appointment Requests</h2>
                      <p className="admin-subtitle">Confirm, reject, reschedule, mark completed, or toggle offline payment status.</p>
                    </div>
                    <div style={{ position: 'relative', width: '240px' }}>
                      <input
                        type="text"
                        placeholder="Search patient or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    </div>
                  </div>

                  {filteredAppointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Patient Basic Details</th>
                            <th>Service Requested</th>
                            <th>Date & Time</th>
                            <th>Venue / Location</th>
                            <th>Status & Payment</th>
                            <th>Specialist Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((apt) => (
                            <tr key={apt._id}>
                              <td>
                                <strong>{apt.patientName}</strong>
                                <div className="table-sub-text"><Phone size={12} /> {apt.phone}</div>
                                {apt.email && <div className="table-sub-text">{apt.email}</div>}
                                {apt.notes && <div className="table-sub-text" style={{ fontStyle: 'italic', marginTop: '0.2rem' }}>Note: {apt.notes}</div>}
                              </td>
                              <td>
                                <div>
                                  {apt.appointmentType === 'home' ? (
                                    <span className="status-badge status-home" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                      <Home size={12} /> Home Physio
                                    </span>
                                  ) : (
                                    <span className="status-badge status-upcoming" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                      <MapPin size={12} /> Clinic Visit
                                    </span>
                                  )}
                                </div>
                                <strong>{apt.service}</strong>
                              </td>
                              <td>
                                <div><strong>{apt.date}</strong></div>
                                <div className="table-sub-text"><Clock size={12} /> {apt.timeSlot}</div>
                              </td>
                              <td>
                                {apt.appointmentType === 'home' ? (
                                  <div>
                                    <strong>{apt.homeAddress}</strong>
                                    <div className="table-sub-text">{apt.cityArea}</div>
                                  </div>
                                ) : (
                                  <div className="table-sub-text">Satya Physiotherapy Center</div>
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span className={`status-badge status-${apt.status}`}>
                                    {apt.status.toUpperCase()}
                                  </span>
                                  <button
                                    className={`status-badge ${apt.paymentStatus === 'paid' ? 'status-completed' : 'status-cancelled'}`}
                                    onClick={() => handleTogglePayment(apt._id, apt.paymentStatus)}
                                    title="Click to toggle Offline Payment status"
                                    style={{ cursor: 'pointer', border: 'none', textAlign: 'center' }}
                                  >
                                    <DollarSign size={12} /> {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  {apt.status === 'upcoming' && (
                                    <>
                                      <button
                                        className="btn btn-teal doc-btn-sm"
                                        onClick={() => handleUpdateStatus(apt._id, 'completed')}
                                      >
                                        <Check size={14} /> Mark Completed
                                      </button>

                                      <button
                                        className="btn btn-outline-dark doc-btn-sm"
                                        onClick={() => setRescheduleModal({ isOpen: true, aptId: apt._id, date: apt.date, timeSlot: apt.timeSlot })}
                                      >
                                        Reschedule
                                      </button>

                                      <button
                                        className="action-btn-danger-text"
                                        onClick={() => setCancelModal({ isOpen: true, aptId: apt._id, reason: '' })}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {apt.status === 'completed' && (
                                    <span className="table-sub-text" style={{ color: '#00b493', fontWeight: 'bold' }}>✓ Consultation Finished</span>
                                  )}
                                  {apt.status === 'cancelled' && (
                                    <span className="table-sub-text" style={{ color: '#ef4444' }}>Cancelled</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <Search size={32} />
                      </div>
                      <h3>No Appointments Found</h3>
                      <p>No appointment records match your search criteria.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: APPOINTMENT HISTORY */}
              {activeTab === 'history' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Completed & Past Appointment History</h2>
                      <p className="admin-subtitle">Record of finished consultations, notes, and patient basic details.</p>
                    </div>
                  </div>

                  {completedAppointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Patient Name & Phone</th>
                            <th>Service Rendered</th>
                            <th>Completion Date</th>
                            <th>Venue</th>
                            <th>Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedAppointments.map((apt) => (
                            <tr key={apt._id}>
                              <td>
                                <strong>{apt.patientName}</strong>
                                <div className="table-sub-text"><Phone size={12} /> {apt.phone}</div>
                              </td>
                              <td><strong>{apt.service}</strong></td>
                              <td>{apt.date} at {apt.timeSlot}</td>
                              <td>{apt.appointmentType === 'home' ? `${apt.homeAddress}, ${apt.cityArea}` : 'Clinic'}</td>
                              <td>
                                <span className="status-badge status-completed">
                                  <CheckCircle2 size={12} /> {apt.paymentStatus === 'paid' ? 'Paid (Offline)' : 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3>No Completed Consultations Yet</h3>
                      <p>Completed appointments will be archived here automatically.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PROFILE & CLINICAL CREDENTIALS */}
              {activeTab === 'profile' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Profile & Clinical Credentials Management</h2>
                      <p className="admin-subtitle">Update your qualifications, experience, specializations, services, consultation fee, and available time slots.</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="booking-form-body">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Doctor Full Name</label>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Qualifications (Degree / Certification)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MPT (Orthopedics), BPT"
                          value={profile.qualification}
                          onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Clinical Experience (Years)</label>
                        <input
                          type="number"
                          required
                          value={profile.experienceYears}
                          onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Primary Specialization</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Spine & Joint Rehabilitation"
                          value={profile.specialization}
                          onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Consultation Fee</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ₹800"
                          value={profile.consultationFee}
                          onChange={(e) => setProfile({ ...profile, consultationFee: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Services Offered (Comma Separated)</label>
                        <input
                          type="text"
                          required
                          placeholder="Orthopedic Rehab, Sports Injury Care, Spine Therapy"
                          value={Array.isArray(profile.servicesOffered) ? profile.servicesOffered.join(', ') : profile.servicesOffered}
                          onChange={(e) => setProfile({ ...profile, servicesOffered: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Available Daily Time Slots (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        placeholder="09:00 AM, 10:00 AM, 11:30 AM, 02:00 PM, 04:00 PM, 05:30 PM"
                        value={Array.isArray(profile.availableSlots) ? profile.availableSlots.join(', ') : profile.availableSlots}
                        onChange={(e) => setProfile({ ...profile, availableSlots: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Clinical Bio / Special Interests</label>
                      <textarea
                        rows={4}
                        required
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-teal">
                      Save Clinical Credentials & Time Slots
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">System Notifications</h2>
                  </div>

                  {notifications.length > 0 ? (
                    <div className="notifications-list">
                      {notifications.map((n) => (
                        <div key={n._id} className={`notif-card ${!n.read ? 'unread' : ''}`}>
                          <div className="notif-header">
                            <span className="notif-title"><Bell size={16} /> {n.title}</span>
                            <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="notif-msg">{n.message}</p>
                          {!n.read && (
                            <button className="mark-read-btn" onClick={() => handleMarkNotificationRead(n._id)}>
                              Mark as Read
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <Bell size={32} />
                      </div>
                      <h3>No System Notifications</h3>
                      <p>You have no unread notifications.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reschedule Modal */}
      {rescheduleModal.isOpen && (
        <div className="modal-backdrop" onClick={() => setRescheduleModal({ isOpen: false, aptId: null, date: '', timeSlot: '10:00 AM' })}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '1.75rem' }}>
            <div className="booking-modal-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3>Reschedule Appointment</h3>
                <p className="table-sub-text">Choose new date & time slot for patient</p>
              </div>
              <button className="modal-close-btn" onClick={() => setRescheduleModal({ isOpen: false, aptId: null, date: '', timeSlot: '10:00 AM' })}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>New Appointment Date *</label>
                <input
                  type="date"
                  required
                  value={rescheduleModal.date}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, date: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Select Time Slot *</label>
                <select
                  value={rescheduleModal.timeSlot}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, timeSlot: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  {(Array.isArray(profile.availableSlots) ? profile.availableSlots : ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM"]).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline-dark doc-btn-sm"
                  onClick={() => setRescheduleModal({ isOpen: false, aptId: null, date: '', timeSlot: '10:00 AM' })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-teal doc-btn-sm">
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel / Reject Modal */}
      {cancelModal.isOpen && (
        <div className="modal-backdrop" onClick={() => setCancelModal({ isOpen: false, aptId: null, reason: '' })}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '1.75rem' }}>
            <div className="booking-modal-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3>Reject / Cancel Appointment</h3>
                <p className="table-sub-text">Provide cancellation note for patient</p>
              </div>
              <button className="modal-close-btn" onClick={() => setCancelModal({ isOpen: false, aptId: null, reason: '' })}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Cancellation Reason / Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Doctor unavailable at selected slot, please reschedule."
                  value={cancelModal.reason}
                  onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline-dark doc-btn-sm"
                  onClick={() => setCancelModal({ isOpen: false, aptId: null, reason: '' })}
                >
                  Dismiss
                </button>
                <button type="submit" className="btn btn-logout-danger doc-btn-sm">
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
