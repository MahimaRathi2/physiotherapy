import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Clock, User, Phone, Mail, FileText, Bell, Lock, Home,
  Search, Plus, CheckCircle2, AlertCircle, X, ShieldCheck,
  Video, MapPin, LogOut, ArrowRight, Download, RefreshCw, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import DoctorDirectory from '../components/doctors/DoctorDirectory';
import BookingModal from '../components/booking/BookingModal';
import '../styles/admin.css';

const PatientDashboard = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [onlineConsultations, setOnlineConsultations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal Trigger
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalType, setBookingModalType] = useState('in-person');
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.autoOpenBooking) {
      handleOpenBooking(location.state.bookingType || 'in-person', location.state.preselectedDoctor);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [aptsRes, onlRes, notifRes] = await Promise.all([
        api.getMyAppointments().catch(() => ({ data: [] })),
        api.getMyOnlineConsultations().catch(() => ({ data: [] })),
        api.getNotifications().catch(() => ({ data: [], unreadCount: 0 }))
      ]);

      setAppointments(aptsRes.data || []);
      setOnlineConsultations(onlRes.data || []);
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.error("Failed to load patient dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (type = 'in-person', doctor = null) => {
    setBookingModalType(type);
    setPreselectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      await updateProfile(profileForm);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    try {
      await changePassword(passwordForm);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password' });
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.cancelAppointment(id);
      loadDashboardData();
    } catch (err) {
      alert(err.message || "Failed to cancel appointment");
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      loadDashboardData();
    } catch (err) {
      console.error("Notification mark read failed:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'MR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="patient-dashboard-root">
      {/* Main Content Area */}
      <main className="patient-main-page">
        <div className="patient-dashboard-container">
          {/* Sidebar + Main Grid */}
          <div className="patient-portal-layout">
            {/* Sidebar Navigation */}
            <aside className="patient-sidebar">
              <nav className="sidebar-menu">
                {/* User Profile Summary Header (Unified in single block) */}
                <div className="sidebar-user-card-header">
                  <div className="user-avatar-badge">
                    {getInitials(user?.name || 'Mahima Rathi')}
                  </div>
                  <div className="user-info-text">
                    <h3>{user?.name || 'Mahima Rathi'}</h3>
                    <p>{user?.email || 'patient@example.com'}</p>
                    <span className="user-role-tag">PATIENT PORTAL</span>
                  </div>
                </div>

                <div className="sidebar-section-title">PORTAL MENU</div>

                <button
                  className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="sidebar-link-icon"><Calendar size={18} /></span>
                  <span className="sidebar-link-text">Overview</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appointments')}
                >
                  <span className="sidebar-link-icon"><MapPin size={18} /></span>
                  <span className="sidebar-link-text">My Appointments</span>
                  {appointments.length > 0 && <span className="sidebar-badge">{appointments.length}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'online' ? 'active' : ''}`}
                  onClick={() => setActiveTab('online')}
                >
                  <span className="sidebar-link-icon"><Video size={18} /></span>
                  <span className="sidebar-link-text">Online Consultations</span>
                  {onlineConsultations.length > 0 && <span className="sidebar-badge">{onlineConsultations.length}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'doctors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('doctors')}
                >
                  <span className="sidebar-link-icon"><User size={18} /></span>
                  <span className="sidebar-link-text">Find Specialists</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <span className="sidebar-link-icon"><Bell size={18} /></span>
                  <span className="sidebar-link-text">Notifications</span>
                  {unreadNotifs > 0 && <span className="sidebar-badge badge-unread">{unreadNotifs}</span>}
                </button>

                <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>BOOK APPOINTMENT</div>

                <button
                  className="sidebar-link sidebar-action-btn"
                  onClick={() => handleOpenBooking('in-person')}
                >
                  <span className="sidebar-link-icon"><MapPin size={18} /></span>
                  <span className="sidebar-link-text">Book Clinic Visit</span>
                </button>

                <button
                  className="sidebar-link sidebar-action-btn"
                  onClick={() => handleOpenBooking('home')}
                >
                  <span className="sidebar-link-icon"><Home size={18} /></span>
                  <span className="sidebar-link-text">Book Home Visit</span>
                </button>

                <button
                  className="sidebar-link sidebar-action-btn"
                  onClick={() => handleOpenBooking('online')}
                >
                  <span className="sidebar-link-icon"><Video size={18} /></span>
                  <span className="sidebar-link-text">Request Online Consult</span>
                </button>

                <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>ACCOUNT & SECURITY</div>

                <button
                  className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="sidebar-link-icon"><User size={18} /></span>
                  <span className="sidebar-link-text">Edit Profile</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <span className="sidebar-link-icon"><Lock size={18} /></span>
                  <span className="sidebar-link-text">Change Password</span>
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
                  <span className="helpline-label">Need Urgent Assistance?</span>
                  <a href="tel:+917500831828" className="helpline-number">
                    +91 7500831828
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Panel Content (RIGHT SIDE) */}
            <div className="patient-content-area">
              {/* Welcome Hero Bar (Positioned on the RIGHT side) */}
              <div className="patient-hero-bar">
                <div className="patient-welcome">
                  <h1>
                    Welcome Back, <span className="serif-italic-teal">{user?.name || 'Mahima Rathi'}</span>
                  </h1>
                  <p>Manage your clinic visits, home physiotherapy visits, online consultation requests, and specialist bookings.</p>
                </div>
              </div>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  {/* KPI Quick Cards */}
                  <div className="patient-kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-teal">
                        <MapPin size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Clinic Appointments</div>
                        <div className="kpi-value">{appointments.length}</div>
                        <div className="kpi-sub">
                          {appointments.filter((a) => a.status === 'upcoming').length} Upcoming Visits
                        </div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-navy">
                        <Video size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Online Consultations</div>
                        <div className="kpi-value">{onlineConsultations.length}</div>
                        <div className="kpi-sub">Report reviews pending</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-orange">
                        <Bell size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Unread Updates</div>
                        <div className="kpi-value">{unreadNotifs}</div>
                        <div className="kpi-sub">System notifications</div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Visit Highlights */}
                  <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
                    <div className="admin-panel-header">
                      <h2 className="admin-panel-title">Upcoming Appointments</h2>
                      <button className="btn btn-outline-dark doc-btn-sm" onClick={() => setActiveTab('appointments')}>
                        View All
                      </button>
                    </div>

                    {appointments.filter((a) => a.status === 'upcoming').length > 0 ? (
                      <div className="appointments-list-cards">
                        {appointments
                          .filter((a) => a.status === 'upcoming')
                          .slice(0, 2)
                          .map((apt) => (
                            <div key={apt._id} className="apt-item-card">
                              <div className="apt-item-main">
                                <div className="apt-date-badge">
                                  <Calendar size={18} />
                                  <span>{apt.date}</span>
                                </div>
                                <div className="apt-details">
                                  <h3>{apt.service}</h3>
                                  <p className="apt-doc">Specialist: <strong>{apt.specialist}</strong></p>
                                  <p className="apt-time"><Clock size={14} /> Time Slot: {apt.timeSlot}</p>
                                  {apt.appointmentType === 'home' && (
                                    <p className="table-sub-text" style={{ color: '#d97706', marginTop: '0.2rem' }}>
                                      📍 Home Visit Address: {apt.homeAddress}, {apt.cityArea}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="apt-item-right">
                                {apt.appointmentType === 'home' ? (
                                  <span className="status-badge status-home">Home Physiotherapy</span>
                                ) : (
                                  <span className="status-badge status-upcoming">Clinic Visit</span>
                                )}
                                <button className="action-btn-danger-text" onClick={() => handleCancelAppointment(apt._id)}>
                                  Cancel Booking
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="empty-state-block">
                        <div className="empty-state-icon-wrap">
                          <Calendar size={28} />
                        </div>
                        <h3>No Upcoming Visits</h3>
                        <p>You have no upcoming clinic or home physiotherapy visits scheduled right now.</p>
                        <div className="empty-state-actions">
                          <button className="btn btn-teal doc-btn-sm" onClick={() => handleOpenBooking('in-person')}>
                            <MapPin size={16} /> Book Clinic Visit
                          </button>
                          <button className="btn btn-outline-dark doc-btn-sm" onClick={() => handleOpenBooking('home')}>
                            <Home size={16} /> Book Home Visit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: MY APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">My Scheduled Appointments</h2>
                  </div>

                  {appointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Type & Service</th>
                            <th>Specialist</th>
                            <th>Date & Time</th>
                            <th>Venue / Address</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((apt) => (
                            <tr key={apt._id}>
                              <td>
                                <div>
                                  {apt.appointmentType === 'home' ? (
                                    <span className="status-badge status-home" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                      Home Physiotherapy
                                    </span>
                                  ) : (
                                    <span className="status-badge status-upcoming" style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                      Clinic Visit
                                    </span>
                                  )}
                                </div>
                                <strong>{apt.service}</strong>
                                {apt.notes && <div className="table-sub-text">{apt.notes}</div>}
                              </td>
                              <td>{apt.specialist}</td>
                              <td>
                                <div><strong>{apt.date}</strong></div>
                                <div className="table-sub-text">{apt.timeSlot}</div>
                              </td>
                              <td>
                                {apt.appointmentType === 'home' ? (
                                  <div>
                                    <div><strong>{apt.homeAddress}</strong></div>
                                    <div className="table-sub-text">{apt.cityArea}</div>
                                  </div>
                                ) : (
                                  <div className="table-sub-text">Satya Physiotherapy Center</div>
                                )}
                              </td>
                              <td>
                                {apt.status === 'upcoming' && (
                                  <span className="status-badge status-upcoming">Upcoming</span>
                                )}
                                {apt.status === 'completed' && (
                                  <span className="status-badge status-completed">Completed</span>
                                )}
                                {apt.status === 'cancelled' && (
                                  <span className="status-badge status-cancelled">Cancelled</span>
                                )}
                              </td>
                              <td>
                                {apt.status === 'upcoming' && (
                                  <button className="action-btn-danger-text" onClick={() => handleCancelAppointment(apt._id)}>
                                    Cancel
                                  </button>
                                )}
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
                      <h3>No Scheduled Appointments</h3>
                      <p>You haven't scheduled any clinic or home physiotherapy appointments yet. Choose an option below to schedule your visit with our specialists.</p>
                      <div className="empty-state-actions">
                        <button className="btn btn-teal doc-btn-sm" onClick={() => handleOpenBooking('in-person')}>
                          <MapPin size={16} /> Book Clinic Visit
                        </button>
                        <button className="btn btn-outline-dark doc-btn-sm" onClick={() => handleOpenBooking('home')}>
                          <Home size={16} /> Book Home Visit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ONLINE CONSULTATIONS */}
              {activeTab === 'online' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">Online Consultation Requests & Reports</h2>
                    <button className="btn btn-teal doc-btn-sm" onClick={() => handleOpenBooking('online')}>
                      <Plus size={16} /> New Request
                    </button>
                  </div>

                  {onlineConsultations.length > 0 ? (
                    <div className="online-requests-grid">
                      {onlineConsultations.map((req) => (
                        <div key={req._id} className="online-req-card">
                          <div className="req-header">
                            <span className="status-badge status-upcoming">{req.status}</span>
                            <span className="req-date"><Calendar size={14} /> {req.preferredDate} ({req.preferredTime})</span>
                          </div>

                          <div className="req-body">
                            <h3>Condition / Reported Symptoms</h3>
                            <p>{req.condition}</p>
                            {req.additionalInfo && (
                              <p className="req-notes"><strong>Notes:</strong> {req.additionalInfo}</p>
                            )}
                          </div>

                          {req.reportFile && (
                            <div className="req-attachment">
                              <FileText size={16} className="info-icon-teal" />
                              <a
                                href={`http://localhost:5000${req.reportFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="report-link"
                              >
                                View / Download Uploaded Medical Report
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <Video size={32} />
                      </div>
                      <h3>No Online Consultations Submitted</h3>
                      <p>You haven't submitted any online consultation or report review requests yet. Submit your medical reports for specialist review.</p>
                      <div className="empty-state-actions">
                        <button className="btn btn-teal doc-btn-sm" onClick={() => handleOpenBooking('online')}>
                          <Plus size={16} /> Request Online Consult
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FIND & BOOK SPECIALISTS */}
              {activeTab === 'doctors' && (
                <div>
                  <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="admin-panel-title">Browse Clinic Specialists & Book Direct</h2>
                  </div>
                  <DoctorDirectory onSelectBooking={handleOpenBooking} />
                </div>
              )}

              {/* TAB 5: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">System Notifications</h2>
                  </div>

                  {notifications.length > 0 ? (
                    <div className="notifs-list">
                      {notifications.map((n) => (
                        <div key={n._id} className={`notif-card ${!n.read ? 'unread' : ''}`}>
                          <div className="notif-top">
                            <div className="notif-title">
                              <Bell size={16} className="info-icon-teal" />
                              <strong>{n.title}</strong>
                            </div>
                            <span className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</span>
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
                    <div className="panel-empty-state">
                      <p>No notifications available.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: EDIT PROFILE */}
              {activeTab === 'profile' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">Patient Profile Information</h2>
                  </div>

                  {profileMsg.text && (
                    <div className={`auth-alert ${profileMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                      <span>{profileMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="booking-form-body">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Residential / Home Address</label>
                      <textarea
                        rows={3}
                        placeholder="Enter your complete street/home address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-light, #cbd5e1)', fontSize: '0.95rem', resize: 'vertical' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-teal">
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: CHANGE PASSWORD */}
              {activeTab === 'password' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <h2 className="admin-panel-title">Change Account Password</h2>
                  </div>

                  {passwordMsg.text && (
                    <div className={`auth-alert ${passwordMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                      <span>{passwordMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="booking-form-body">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        required
                        minlength="6"
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-outline-dark">
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Shared Dual-Option Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          loadDashboardData();
        }}
        initialType={bookingModalType}
        preselectedDoctor={preselectedDoctor}
      />
    </div>
  );
};

export default PatientDashboard;
