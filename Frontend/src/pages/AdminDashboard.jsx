import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Users, DollarSign, Activity, Plus, Search,
  CheckCircle, Clock, AlertCircle, X, ChevronRight,
  ArrowLeft, MessageSquare, Briefcase, Eye, Trash2, Check, RefreshCw,
  Award, ShieldCheck, Settings, Phone, Mail, FileText, Video, MapPin, LogOut, ArrowRight as ArrowIcon, Star, CheckCircle2, BookOpen,
  Feather, Send, Bookmark, Code, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Quote, Table, RotateCcw, RotateCw, Image as ImageIcon, Tag, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Live Data States
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    totalConsultations: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    totalEstRevenue: '₹0'
  });
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [services, setServices] = useState([]);
  const [onlineConsultations, setOnlineConsultations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState({
    clinicName: 'Satya Physiotherapy Center',
    address: 'Plot 12, Main Ring Road, Lajpat Nagar, New Delhi - 110024',
    phone: '+91 93106 60524',
    emergencyHelpline: '+91 98110 24567',
    email: 'contact@satyaphyseo.com',
    businessHours: 'Mon - Sat: 08:00 AM - 08:00 PM | Sun: 09:00 AM - 02:00 PM',
    siteAnnouncement: 'Welcome to Satya Physiotherapy Center — Evidence-Based Non-Surgical Recovery.'
  });

  // Modal States
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '', qualification: 'MPT (Orthopedics)', experienceYears: 8, specialization: 'Spine & Joint Rehabilitation', consultationFee: '₹800'
  });

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '', duration: '45 mins', price: '₹1,200', desc: '', category: 'Rehabilitation'
  });

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '', role: 'Patient', content: '', rating: 5
  });

  // Blog View & Editor States matching reference design
  const [blogViewMode, setBlogViewMode] = useState('list'); // 'list' | 'editor'
  const [editorTab, setEditorTab] = useState('editor'); // 'editor' | 'seo'
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Spine & Joint Care',
    author: 'Dr. Satya Prakash & Team',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    content: '',
    status: 'Published',
    tags: ['#SpineHealth', '#Physiotherapy'],
    metaTitle: '',
    metaDesc: '',
    focusKeywords: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [htmlSourceMode, setHtmlSourceMode] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, aptsRes, docsRes, usersRes, servRes, onlRes, testRes, inqRes, settRes, blogRes
      ] = await Promise.all([
        api.getAdminStats().catch(() => ({ data: null })),
        api.getAdminAppointments().catch(() => ({ data: [] })),
        api.getAdminDoctors().catch(() => ({ data: [] })),
        api.getAdminUsers().catch(() => ({ data: [] })),
        api.getAdminServices().catch(() => ({ data: [] })),
        api.getAdminOnlineConsultations().catch(() => ({ data: [] })),
        api.getAdminTestimonials().catch(() => ({ data: [] })),
        api.getAdminInquiries().catch(() => ({ data: [] })),
        api.getSystemSettings().catch(() => ({ data: null })),
        api.getAdminBlogs().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      setAppointments(aptsRes.data || []);
      setDoctors(docsRes.data || []);
      setUsersList(usersRes.data || []);
      setServices(servRes.data || []);
      setOnlineConsultations(onlRes.data || []);
      setTestimonials(testRes.data || []);
      setInquiries(inqRes.data || []);
      setBlogs(blogRes.data || []);
      if (settRes?.data) setSettings(settRes.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleVerifyDoctor = async (id) => {
    try {
      await api.verifyDoctor(id);
      setStatusMsg({ type: 'success', text: 'Doctor verification status updated!' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Action failed' });
    }
  };

  const handleCreateDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminDoctor(newDoctor);
      setStatusMsg({ type: 'success', text: 'New Physiotherapist onboarded successfully!' });
      setDoctorModalOpen(false);
      setNewDoctor({ name: '', qualification: 'MPT (Orthopedics)', experienceYears: 8, specialization: 'Spine & Joint Rehabilitation', consultationFee: '₹800' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to create doctor' });
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setStatusMsg({ type: 'success', text: `User role updated to ${newRole.toUpperCase()}` });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update role' });
    }
  };

  const handleCreateServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminService(newService);
      setStatusMsg({ type: 'success', text: 'Service created successfully!' });
      setServiceModalOpen(false);
      setNewService({ title: '', duration: '45 mins', price: '₹1,200', desc: '', category: 'Rehabilitation' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to create service' });
    }
  };

  // Blog Editor Handlers
  const handleOpenCreateBlog = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Spine & Joint Care',
      author: 'Dr. Satya Prakash & Team',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      content: '',
      status: 'Published',
      tags: ['#SpineHealth', '#Physiotherapy'],
      metaTitle: '',
      metaDesc: '',
      focusKeywords: ''
    });
    setBlogViewMode('editor');
    setEditorTab('editor');
  };

  const handleOpenEditBlog = (b) => {
    setEditingBlogId(b._id);
    setBlogForm({
      title: b.title || '',
      slug: b.slug || '',
      category: b.category || 'Spine & Joint Care',
      author: b.author || 'Dr. Satya Prakash & Team',
      readTime: b.readTime || '5 min read',
      image: b.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      excerpt: b.excerpt || '',
      content: b.content || '',
      status: b.published ? 'Published' : 'Draft',
      tags: b.tags || ['#SpineHealth', '#Physiotherapy'],
      metaTitle: b.metaTitle || b.title || '',
      metaDesc: b.metaDesc || b.excerpt || '',
      focusKeywords: b.focusKeywords || b.category || ''
    });
    setBlogViewMode('editor');
    setEditorTab('editor');
  };

  const handleTitleChange = (val) => {
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setBlogForm(prev => ({
      ...prev,
      title: val,
      slug: editingBlogId ? prev.slug : generatedSlug
    }));
  };

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    if (!tagInput.trim()) return;
    const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
    if (!blogForm.tags.includes(newTag)) {
      setBlogForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setBlogForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const insertFormat = (before, after = '') => {
    const textarea = document.getElementById('blog-content-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = blogForm.content;
    const selectedText = text.substring(start, end) || 'text';
    const replacement = before + selectedText + after;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setBlogForm(prev => ({ ...prev, content: newContent }));
  };

  const handlePublishOrSaveBlog = async (e, overrideStatus = null) => {
    if (e) e.preventDefault();
    const publishStatus = overrideStatus || blogForm.status;
    const isPublished = publishStatus === 'Published';

    const payload = {
      title: blogForm.title,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: blogForm.category,
      author: blogForm.author,
      readTime: blogForm.readTime,
      image: blogForm.image,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      published: isPublished,
      tags: blogForm.tags
    };

    try {
      if (editingBlogId) {
        await api.updateAdminBlog(editingBlogId, payload);
        setStatusMsg({ type: 'success', text: 'Blog article updated successfully!' });
      } else {
        await api.createAdminBlog(payload);
        setStatusMsg({ type: 'success', text: `Blog article ${isPublished ? 'published' : 'saved as draft'} successfully!` });
      }
      setBlogViewMode('list');
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save blog article' });
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog article?")) return;
    try {
      await api.deleteAdminBlog(id);
      setStatusMsg({ type: 'success', text: 'Blog article deleted successfully!' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete blog article' });
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to remove this service?")) return;
    try {
      await api.deleteAdminService(id);
      setStatusMsg({ type: 'success', text: 'Service removed successfully!' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete service' });
    }
  };

  const handleTogglePayment = async (id, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await api.updateAdminPaymentStatus(id, newStatus);
      setStatusMsg({ type: 'success', text: `Payment status updated to ${newStatus.toUpperCase()}` });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update payment' });
    }
  };

  const handleUpdateAptStatus = async (id, status) => {
    try {
      await api.updateAdminAppointmentStatus(id, status);
      setStatusMsg({ type: 'success', text: `Appointment status updated to ${status.toUpperCase()}` });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleCreateTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminTestimonial(newTestimonial);
      setStatusMsg({ type: 'success', text: 'Testimonial added!' });
      setTestimonialModalOpen(false);
      setNewTestimonial({ name: '', role: 'Patient', content: '', rating: 5 });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add testimonial' });
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      await api.deleteAdminTestimonial(id);
      setStatusMsg({ type: 'success', text: 'Testimonial removed!' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete testimonial' });
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateSystemSettings(settings);
      setStatusMsg({ type: 'success', text: 'System Settings updated successfully!' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update settings' });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = String(name).trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return String(name).slice(0, 2).toUpperCase();
  };

  const filteredAppointments = (appointments || []).filter(a =>
    (a?.patientName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (a?.phone || '').includes(searchTerm || '') ||
    (a?.service || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb', color: '#0f172a', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} className="spin-icon" style={{ color: '#0284c7', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Loading Admin Control Center...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard-root">
      <main className="patient-main-page">
        <div className="patient-dashboard-container">
          <div className="patient-portal-layout">
            {/* Sidebar Navigation (Identical structure to Patient & Doctor dashboards) */}
            <aside className="patient-sidebar">
              <nav className="sidebar-menu">
                <div className="sidebar-user-card-header">
                  <div className="user-avatar-badge" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                    {getInitials(user?.name || 'Admin Console')}
                  </div>
                  <div className="user-info-text">
                    <h3>{user?.name || 'Administrator'}</h3>
                    <p>{user?.email || 'admin@satyaphyseo.com'}</p>
                    <span className="user-role-tag" style={{ background: '#fef3c7', color: '#b45309' }}>ADMIN CONSOLE</span>
                  </div>
                </div>

                <div className="sidebar-section-title">ADMIN CONTROL CENTER</div>

                <button
                  className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="sidebar-link-icon"><Activity size={18} /></span>
                  <span className="sidebar-link-text">Analytics & Overview</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appointments')}
                >
                  <span className="sidebar-link-icon"><Calendar size={18} /></span>
                  <span className="sidebar-link-text">All Appointments</span>
                  {appointments.length > 0 && <span className="sidebar-badge">{appointments.length}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'doctors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('doctors')}
                >
                  <span className="sidebar-link-icon"><ShieldCheck size={18} /></span>
                  <span className="sidebar-link-text">Physiotherapists</span>
                  {stats.pendingDoctors > 0 && <span className="sidebar-badge badge-unread">{stats.pendingDoctors} Unverified</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <span className="sidebar-link-icon"><Users size={18} /></span>
                  <span className="sidebar-link-text">Patients & Users</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'services' ? 'active' : ''}`}
                  onClick={() => setActiveTab('services')}
                >
                  <span className="sidebar-link-icon"><Briefcase size={18} /></span>
                  <span className="sidebar-link-text">Services Offered</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'consultations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('consultations')}
                >
                  <span className="sidebar-link-icon"><Video size={18} /></span>
                  <span className="sidebar-link-text">Online Consultations</span>
                </button>

                <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>CONTENT & SYSTEM</div>

                <button
                  className={`sidebar-link ${activeTab === 'testimonials' ? 'active' : ''}`}
                  onClick={() => setActiveTab('testimonials')}
                >
                  <span className="sidebar-link-icon"><Star size={18} /></span>
                  <span className="sidebar-link-text">Testimonials & Reviews</span>
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'blogs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('blogs')}
                >
                  <span className="sidebar-link-icon"><BookOpen size={18} /></span>
                  <span className="sidebar-link-text">Blog Articles</span>
                  {blogs.length > 0 && <span className="sidebar-badge">{blogs.length}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'inquiries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inquiries')}
                >
                  <span className="sidebar-link-icon"><MessageSquare size={18} /></span>
                  <span className="sidebar-link-text">Contact Inquiries</span>
                  {stats.unreadInquiries > 0 && <span className="sidebar-badge badge-unread">{stats.unreadInquiries}</span>}
                </button>

                <button
                  className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <span className="sidebar-link-icon"><Settings size={18} /></span>
                  <span className="sidebar-link-text">System Settings</span>
                </button>

                <Link to="/" className="sidebar-link" style={{ marginTop: '0.25rem' }}>
                  <span className="sidebar-link-icon"><ArrowIcon size={18} /></span>
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
            </aside>

            {/* Main Content Area (RIGHT SIDE) */}
            <div className="patient-content-area">
              <div className="patient-hero-bar">
                <div className="patient-welcome">
                  <h1>
                    Welcome to <span className="serif-italic-teal">Clinic System Administration</span>
                  </h1>
                  <p>Manage bookings, physiotherapist verifications, services, users, offline payment records, and website content.</p>
                </div>
              </div>

              {statusMsg.text && (
                <div className={`auth-alert ${statusMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} />
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* TAB 1: OVERVIEW & ANALYTICS */}
              {activeTab === 'overview' && (
                <div>
                  <div className="patient-kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-teal">
                        <Users size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Registered Patients</div>
                        <div className="kpi-value">{stats.totalPatients}</div>
                        <div className="kpi-sub">Total patient accounts</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-navy">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Active Specialists</div>
                        <div className="kpi-value">{stats.totalDoctors}</div>
                        <div className="kpi-sub">{stats.pendingDoctors} pending verification</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-orange">
                        <Calendar size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Total Bookings</div>
                        <div className="kpi-value">{stats.totalAppointments}</div>
                        <div className="kpi-sub">{stats.completedAppointments} completed</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-wrap kpi-icon-purple">
                        <DollarSign size={24} />
                      </div>
                      <div className="kpi-content">
                        <div className="kpi-label">Est. Revenue Recorded</div>
                        <div className="kpi-value">{stats.totalEstRevenue}</div>
                        <div className="kpi-sub">Paid consultations</div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
                    <div className="admin-panel-header">
                      <h2 className="admin-panel-title">Recent Appointment Activity</h2>
                      <button className="btn btn-outline-dark doc-btn-sm" onClick={() => setActiveTab('appointments')}>
                        View All Bookings
                      </button>
                    </div>

                    {appointments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Patient Name</th>
                              <th>Service & Specialist</th>
                              <th>Date & Slot</th>
                              <th>Status</th>
                              <th>Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.slice(0, 5).map((apt) => (
                              <tr key={apt._id}>
                                <td>
                                  <strong>{apt.patientName}</strong>
                                  <div className="table-sub-text">{apt.phone}</div>
                                </td>
                                <td>
                                  <strong>{apt.service}</strong>
                                  <div className="table-sub-text">{apt.specialist}</div>
                                </td>
                                <td>{apt.date} at {apt.timeSlot}</td>
                                <td><span className={`status-badge status-${apt.status || 'upcoming'}`}>{(apt?.status || 'upcoming').toUpperCase()}</span></td>
                                <td>
                                  <span className={`status-badge ${apt.paymentStatus === 'paid' ? 'status-completed' : 'status-cancelled'}`}>
                                    {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending (Offline)'}
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
                          <Calendar size={32} />
                        </div>
                        <h3>No Bookings Yet</h3>
                        <p>No appointment records found in system database.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: APPOINTMENTS & BOOKINGS */}
              {activeTab === 'appointments' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">All Clinic & Home Appointment Bookings</h2>
                      <p className="admin-subtitle">Update status, mark completion, or toggle offline payment status.</p>
                    </div>
                    <div style={{ position: 'relative', width: '240px' }}>
                      <input
                        type="text"
                        placeholder="Search patient, phone..."
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
                            <th>Service & Specialist</th>
                            <th>Date & Time</th>
                            <th>Venue / Address</th>
                            <th>Status & Payment</th>
                            <th>Admin Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map((apt) => (
                            <tr key={apt._id}>
                              <td>
                                <strong>{apt.patientName}</strong>
                                <div className="table-sub-text">{apt.phone}</div>
                                {apt.email && <div className="table-sub-text">{apt.email}</div>}
                              </td>
                              <td>
                                <div>
                                  {apt.appointmentType === 'home' ? (
                                    <span className="status-badge status-home" style={{ display: 'inline-block', marginBottom: '0.2rem' }}>Home Visit</span>
                                  ) : (
                                    <span className="status-badge status-upcoming" style={{ display: 'inline-block', marginBottom: '0.2rem' }}>Clinic Visit</span>
                                  )}
                                </div>
                                <strong>{apt.service}</strong>
                                <div className="table-sub-text">Specialist: {apt.specialist}</div>
                              </td>
                              <td>
                                <div><strong>{apt.date}</strong></div>
                                <div className="table-sub-text">{apt.timeSlot}</div>
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span className={`status-badge status-${apt.status || 'upcoming'}`}>{(apt?.status || 'upcoming').toUpperCase()}</span>
                                  <button
                                    className={`status-badge ${apt.paymentStatus === 'paid' ? 'status-completed' : 'status-cancelled'}`}
                                    onClick={() => handleTogglePayment(apt._id, apt.paymentStatus)}
                                    style={{ cursor: 'pointer', border: 'none' }}
                                    title="Click to toggle offline payment"
                                  >
                                    <DollarSign size={12} /> {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending (Offline)'}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  {apt.status === 'upcoming' && (
                                    <>
                                      <button className="btn btn-teal doc-btn-sm" onClick={() => handleUpdateAptStatus(apt._id, 'completed')}>
                                        Complete
                                      </button>
                                      <button className="action-btn-danger-text" onClick={() => handleUpdateAptStatus(apt._id, 'cancelled')}>
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                  {apt.status === 'completed' && <span className="table-sub-text" style={{ color: '#00b493', fontWeight: 'bold' }}>✓ Finished</span>}
                                  {apt.status === 'cancelled' && <span className="table-sub-text" style={{ color: '#ef4444' }}>Cancelled</span>}
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
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PHYSIOTHERAPISTS & VERIFICATION */}
              {activeTab === 'doctors' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Physiotherapist Verification & Management</h2>
                      <p className="admin-subtitle">Verify doctor credentials, approve accounts, or add new specialists.</p>
                    </div>
                    <button className="btn btn-teal doc-btn-sm" onClick={() => setDoctorModalOpen(true)}>
                      <Plus size={16} /> Onboard New Specialist
                    </button>
                  </div>

                  {doctors.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Specialist Name</th>
                            <th>Qualification & Experience</th>
                            <th>Specialization</th>
                            <th>Consultation Fee</th>
                            <th>Verification Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {doctors.map((doc) => (
                            <tr key={doc._id}>
                              <td>
                                <strong>{doc.name}</strong>
                                <div className="table-sub-text">{doc.title}</div>
                              </td>
                              <td>
                                <div><strong>{doc.qualification}</strong></div>
                                <div className="table-sub-text">{doc.experienceYears} Years Exp.</div>
                              </td>
                              <td>{doc.specialization}</td>
                              <td><strong>{doc.consultationFee}</strong></td>
                              <td>
                                <span className={`status-badge ${doc.active ? 'status-completed' : 'status-cancelled'}`}>
                                  {doc.active ? 'VERIFIED & ACTIVE' : 'UNVERIFIED / SUSPENDED'}
                                </span>
                              </td>
                              <td>
                                <button
                                  className={`btn ${doc.active ? 'btn-outline-dark' : 'btn-teal'} doc-btn-sm`}
                                  onClick={() => handleVerifyDoctor(doc._id)}
                                >
                                  {doc.active ? 'Suspend Account' : 'Verify & Approve'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <ShieldCheck size={32} />
                      </div>
                      <h3>No Doctors Registered</h3>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PATIENTS & USERS */}
              {activeTab === 'users' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Registered Patients & User Roles</h2>
                      <p className="admin-subtitle">View patient accounts and assign user roles (Patient, Doctor, Admin).</p>
                    </div>
                  </div>

                  {usersList.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>Contact Phone</th>
                            <th>Address</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map((usr) => (
                            <tr key={usr._id}>
                              <td><strong>{usr.name}</strong></td>
                              <td>{usr.email}</td>
                              <td>{usr.phone}</td>
                              <td>{usr.address || 'N/A'}</td>
                              <td>
                                <span className="status-badge status-upcoming">{(usr?.role || 'patient').toUpperCase()}</span>
                              </td>
                              <td>
                                <select
                                  value={usr.role}
                                  onChange={(e) => handleUserRoleChange(usr._id, e.target.value)}
                                  style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                >
                                  <option value="patient">Patient</option>
                                  <option value="doctor">Doctor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <Users size={32} />
                      </div>
                      <h3>No Registered Users</h3>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SERVICES OFFERED */}
              {activeTab === 'services' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Manage Clinic Treatment Services</h2>
                      <p className="admin-subtitle">Create, update, or toggle services displayed on the website.</p>
                    </div>
                    <button className="btn btn-teal doc-btn-sm" onClick={() => setServiceModalOpen(true)}>
                      <Plus size={16} /> Add New Service
                    </button>
                  </div>

                  {services.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Service Title</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((srv) => (
                            <tr key={srv._id}>
                              <td><strong>{srv.title}</strong></td>
                              <td>{srv.duration || '45 mins'}</td>
                              <td><strong>{srv.price || '₹1,200'}</strong></td>
                              <td style={{ maxWidth: '300px' }}><p className="table-sub-text">{srv.desc || srv.description}</p></td>
                              <td>
                                <button className="action-btn-danger-text" onClick={() => handleDeleteService(srv._id)}>
                                  <Trash2 size={16} /> Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <Briefcase size={32} />
                      </div>
                      <h3>No Services Added</h3>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ONLINE CONSULTATIONS */}
              {activeTab === 'consultations' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Online Consultation & Report Submissions</h2>
                      <p className="admin-subtitle">Patient submitted medical reports for review.</p>
                    </div>
                  </div>

                  {onlineConsultations.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Patient Name & Phone</th>
                            <th>Condition Symptoms</th>
                            <th>Preferred Date & Time</th>
                            <th>Report File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {onlineConsultations.map((req) => (
                            <tr key={req._id}>
                              <td>
                                <strong>{req.name}</strong>
                                <div className="table-sub-text">{req.phone}</div>
                              </td>
                              <td>{req.condition}</td>
                              <td>{req.preferredDate} ({req.preferredTime})</td>
                              <td>
                                {req.reportFile ? (
                                  <a href={`http://localhost:5000${req.reportFile}`} target="_blank" rel="noreferrer" className="report-link">
                                    <FileText size={14} /> Download Report
                                  </a>
                                ) : (
                                  <span className="table-sub-text">No File</span>
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
                        <Video size={32} />
                      </div>
                      <h3>No Consultation Submissions</h3>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: TESTIMONIALS & REVIEWS */}
              {activeTab === 'testimonials' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Website Patient Testimonials & Reviews</h2>
                      <p className="admin-subtitle">Manage patient stories and reviews shown on the homepage.</p>
                    </div>
                    <button className="btn btn-teal doc-btn-sm" onClick={() => setTestimonialModalOpen(true)}>
                      <Plus size={16} /> Add Testimonial
                    </button>
                  </div>

                  {testimonials.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Patient Name</th>
                            <th>Condition / Role</th>
                            <th>Testimonial Quote</th>
                            <th>Rating</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testimonials.map((t) => (
                            <tr key={t._id}>
                              <td><strong>{t.name}</strong></td>
                              <td>{t.role || t.condition || 'Patient'}</td>
                              <td style={{ maxWidth: '350px' }}><p className="table-sub-text">"{t.content}"</p></td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.15rem', color: '#f59e0b' }}>
                                  {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" />)}
                                </div>
                              </td>
                              <td>
                                <button className="action-btn-danger-text" onClick={() => handleDeleteTestimonial(t._id)}>
                                  <Trash2 size={16} /> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <Star size={32} />
                      </div>
                      <h3>No Testimonials Found</h3>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: BLOG ARTICLES & MANAGEMENT */}
              {activeTab === 'blogs' && (
                <div>
                  {blogViewMode === 'list' ? (
                    <div className="admin-panel">
                      <div className="admin-panel-header">
                        <div>
                          <h2 className="admin-panel-title">Clinical Blog Articles & Patient Guides</h2>
                          <p className="admin-subtitle">Publish new clinical articles, patient education guides, and evidence-based blogs.</p>
                        </div>
                        <button className="btn btn-teal doc-btn-sm" onClick={handleOpenCreateBlog}>
                          <Plus size={16} /> Publish New Article
                        </button>
                      </div>

                      {blogs.length > 0 ? (
                        <div className="table-responsive">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Article Title & Category</th>
                                <th>Author</th>
                                <th>Read Time</th>
                                <th>Status</th>
                                <th>Excerpt</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {blogs.map((b) => (
                                <tr key={b._id}>
                                  <td>
                                    <strong>{b.title}</strong>
                                    <div className="table-sub-text">
                                      <span className="status-badge status-upcoming" style={{ marginTop: '0.2rem', display: 'inline-block' }}>
                                        {b.category}
                                      </span>
                                    </div>
                                  </td>
                                  <td>{b.author}</td>
                                  <td>{b.readTime}</td>
                                  <td>
                                    <span className={`status-badge ${b.published ? 'status-completed' : 'status-cancelled'}`}>
                                      {b.published ? 'Published' : 'Draft'}
                                    </span>
                                  </td>
                                  <td style={{ maxWidth: '280px' }}>
                                    <p className="table-sub-text">{b.excerpt}</p>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <button
                                        className="btn btn-outline-dark doc-btn-sm"
                                        onClick={() => handleOpenEditBlog(b)}
                                        title="Edit Article"
                                      >
                                        <Edit3 size={14} /> Edit
                                      </button>
                                      <button
                                        className="action-btn-danger-text"
                                        onClick={() => handleDeleteBlog(b._id)}
                                        title="Delete Article"
                                      >
                                        <Trash2 size={14} />
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
                            <BookOpen size={32} />
                          </div>
                          <h3>No Blog Articles Found</h3>
                          <p>Start writing evidence-based clinical guides for your clinic patients.</p>
                          <button className="btn btn-teal" onClick={handleOpenCreateBlog} style={{ marginTop: '0.5rem' }}>
                            <Plus size={16} /> Create First Article
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* DEDICATED EDITOR VIEW MATCHING SCREENSHOT */
                    <div className="blog-editor-wrapper">
                      {/* Top Header Bar */}
                      <div className="blog-editor-top-bar">
                        <div className="blog-editor-top-left">
                          <button className="btn-back-articles" onClick={() => setBlogViewMode('list')}>
                            <ArrowLeft size={16} /> Back to Articles
                          </button>

                          <div className="blog-editor-title-wrap">
                            <div className="blog-editor-icon-badge">
                              <Feather size={20} />
                            </div>
                            <div>
                              <h2>{editingBlogId ? 'Edit Blog Article' : 'Create New Blog Article'}</h2>
                              <p>Blog Management & Publishing</p>
                            </div>
                          </div>
                        </div>

                        <div className="blog-editor-top-right">
                          <div className="mode-tab-switch">
                            <button
                              className={`tab-switch-btn ${editorTab === 'editor' ? 'active' : ''}`}
                              onClick={() => setEditorTab('editor')}
                            >
                              <FileText size={15} /> Editor
                            </button>
                            <button
                              className={`tab-switch-btn ${editorTab === 'seo' ? 'active' : ''}`}
                              onClick={() => setEditorTab('seo')}
                            >
                              <Search size={15} /> SEO
                            </button>
                          </div>

                          <button className="btn-editor-draft" onClick={(e) => handlePublishOrSaveBlog(e, 'Draft')}>
                            <Bookmark size={15} /> Draft
                          </button>

                          <button className="btn-editor-publish" onClick={(e) => handlePublishOrSaveBlog(e, 'Published')}>
                            <Send size={15} /> Publish
                          </button>
                        </div>
                      </div>

                      {/* TAB 1: EDITOR */}
                      {editorTab === 'editor' && (
                        <div className="blog-editor-grid">
                          {/* Left Column: Title, Slug, Excerpt, Content */}
                          <div className="blog-editor-left">
                            <div className="blog-card-box">
                              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Article Title *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. 10 Essential Tips for Board Exam Preparation"
                                  value={blogForm.title}
                                  onChange={(e) => handleTitleChange(e.target.value)}
                                />
                              </div>

                              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>URL Slug</label>
                                <div className="slug-input-wrapper">
                                  <span className="slug-prefix">/blog/</span>
                                  <input
                                    type="text"
                                    placeholder="custom-article-slug"
                                    value={blogForm.slug}
                                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="form-group">
                                <label>Short Excerpt / Summary *</label>
                                <textarea
                                  rows={3}
                                  required
                                  placeholder="Write a concise overview or key takeaway summary of the blog article..."
                                  value={blogForm.excerpt}
                                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                />
                              </div>
                            </div>

                            {/* Rich Content Editor Box */}
                            <div className="blog-card-box">
                              <div className="rich-editor-header">
                                <label>
                                  <Feather size={16} color="#0284c7" /> Blog Content (Rich Text Format) *
                                </label>
                                <button
                                  type="button"
                                  className="btn-toggle-html"
                                  onClick={() => setHtmlSourceMode(!htmlSourceMode)}
                                >
                                  <Code size={14} /> {htmlSourceMode ? 'Edit Rich Text' : '</> Edit HTML Source'}
                                </button>
                              </div>

                              {!htmlSourceMode && (
                                <div className="editor-toolbar">
                                  {/* Group 1: Text Formatting */}
                                  <button type="button" className="tb-btn" title="Bold" onClick={() => insertFormat('**', '**')}>
                                    <strong>B</strong>
                                  </button>
                                  <button type="button" className="tb-btn" title="Italic" onClick={() => insertFormat('*', '*')}>
                                    <em style={{ fontFamily: 'serif' }}>I</em>
                                  </button>
                                  <button type="button" className="tb-btn" title="Underline" onClick={() => insertFormat('<u>', '</u>')}>
                                    <u>U</u>
                                  </button>

                                  <div className="tb-divider" />

                                  {/* Group 2: Headings */}
                                  <select
                                    className="tb-select"
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        insertFormat(e.target.value + ' ', '\n');
                                        e.target.value = '';
                                      }
                                    }}
                                  >
                                    <option value="">Paragraph</option>
                                    <option value="# ">Heading 1</option>
                                    <option value="## ">Heading 2</option>
                                    <option value="### ">Heading 3</option>
                                  </select>

                                  <div className="tb-divider" />

                                  {/* Group 3: Lists */}
                                  <button type="button" className="tb-btn" title="Bullet List" onClick={() => insertFormat('- ')}>
                                    <List size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Numbered List" onClick={() => insertFormat('1. ')}>
                                    <ListOrdered size={16} />
                                  </button>

                                  <div className="tb-divider" />

                                  {/* Group 4: Alignments */}
                                  <button type="button" className="tb-btn" title="Align Left" onClick={() => insertFormat('<div style="text-align:left;">', '</div>')}>
                                    <AlignLeft size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Align Center" onClick={() => insertFormat('<div style="text-align:center;">', '</div>')}>
                                    <AlignCenter size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Align Right" onClick={() => insertFormat('<div style="text-align:right;">', '</div>')}>
                                    <AlignRight size={16} />
                                  </button>

                                  <div className="tb-divider" />

                                  {/* Group 5: Elements */}
                                  <button type="button" className="tb-btn" title="Insert Link" onClick={() => insertFormat('[Link Text](', ')')}>
                                    <Link2 size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Quote" onClick={() => insertFormat('> ')}>
                                    <Quote size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Code Block" onClick={() => insertFormat('```\n', '\n```')}>
                                    <Code size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Table" onClick={() => insertFormat('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n')}>
                                    <Table size={16} />
                                  </button>

                                  <div className="tb-divider" />

                                  {/* Group 6: History */}
                                  <button type="button" className="tb-btn" title="Undo" onClick={() => insertFormat('', '')}>
                                    <RotateCcw size={16} />
                                  </button>
                                  <button type="button" className="tb-btn" title="Redo" onClick={() => insertFormat('', '')}>
                                    <RotateCw size={16} />
                                  </button>
                                </div>
                              )}

                              <textarea
                                id="blog-content-textarea"
                                className="rich-textarea"
                                rows={12}
                                required
                                placeholder="Type your full clinical article content here..."
                                value={blogForm.content}
                                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                              />
                            </div>
                          </div>

                          {/* Right Column: Cover Image & Sidebar Controls */}
                          <div className="blog-editor-right">
                            {/* Cover Image Card */}
                            <div className="blog-card-box">
                              <label>Cover Image</label>
                              <input
                                type="text"
                                placeholder="Image URL..."
                                value={blogForm.image}
                                onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              />

                              <button
                                type="button"
                                className="cover-upload-btn"
                                onClick={() => {
                                  const url = prompt("Enter Cover Image URL:", blogForm.image);
                                  if (url) setBlogForm({ ...blogForm, image: url });
                                }}
                              >
                                <ImageIcon size={16} /> Upload Cover Image
                              </button>

                              {blogForm.image && (
                                <div className="cover-preview-wrapper">
                                  <img src={blogForm.image} alt="Cover Preview" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                              )}
                            </div>

                            {/* Category, Author, Read Time, Status, Tags */}
                            <div className="blog-card-box">
                              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                                <label>Category *</label>
                                <select
                                  value={blogForm.category}
                                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                >
                                  <option value="Spine & Joint Care">Spine & Joint Care</option>
                                  <option value="Post-Surgical Rehab">Post-Surgical Rehab</option>
                                  <option value="Ergonomics & Posture">Ergonomics & Posture</option>
                                  <option value="Neurological Rehab">Neurological Rehab</option>
                                  <option value="Sports Injury">Sports Injury</option>
                                  <option value="Learning Resources">Learning Resources</option>
                                  <option value="General Wellness">General Wellness</option>
                                </select>
                              </div>

                              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                                <label>Author Name *</label>
                                <input
                                  type="text"
                                  required
                                  value={blogForm.author}
                                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                                />
                              </div>

                              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                                <label>Estimated Read Time</label>
                                <input
                                  type="text"
                                  value={blogForm.readTime}
                                  onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                                />
                              </div>

                              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                                <label>Status</label>
                                <select
                                  value={blogForm.status}
                                  onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                                >
                                  <option value="Published">Published</option>
                                  <option value="Draft">Draft</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Tags</label>
                                <div className="tag-chips-wrapper">
                                  {(blogForm?.tags || []).map((tag, idx) => (
                                    <span key={idx} className="tag-chip">
                                      {tag}
                                      <button
                                        type="button"
                                        className="tag-close-btn"
                                        onClick={() => handleRemoveTag(tag)}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <div className="add-tag-row">
                                  <input
                                    type="text"
                                    placeholder="Add tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                      }
                                    }}
                                  />
                                  <button type="button" className="btn-add-tag" onClick={handleAddTag}>
                                    + Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: SEO */}
                      {editorTab === 'seo' && (
                        <div className="blog-editor-grid">
                          <div className="blog-editor-left">
                            <div className="blog-card-box">
                              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Meta Title</label>
                                <input
                                  type="text"
                                  placeholder="SEO Meta Title..."
                                  value={blogForm.metaTitle || blogForm.title}
                                  onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                                />
                              </div>

                              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Meta Description</label>
                                <textarea
                                  rows={3}
                                  placeholder="SEO Meta Description for Search Engines..."
                                  value={blogForm.metaDesc || blogForm.excerpt}
                                  onChange={(e) => setBlogForm({ ...blogForm, metaDesc: e.target.value })}
                                />
                              </div>

                              <div className="form-group">
                                <label>Focus Keywords</label>
                                <input
                                  type="text"
                                  placeholder="e.g. spine care, physiotherapy, back pain relief"
                                  value={blogForm.focusKeywords || blogForm.category}
                                  onChange={(e) => setBlogForm({ ...blogForm, focusKeywords: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="blog-editor-right">
                            <div className="blog-card-box">
                              <label>Google Search Preview</label>
                              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#1a0dab', fontSize: '1rem', fontWeight: 600, textDecoration: 'underline', marginBottom: '0.2rem' }}>
                                  {blogForm.metaTitle || blogForm.title || 'Article Title'}
                                </div>
                                <div style={{ color: '#006621', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                                  https://satyaphyseo.com/blog/{blogForm.slug || 'article-slug'}
                                </div>
                                <div style={{ color: '#545454', fontSize: '0.825rem', lineHeight: '1.5' }}>
                                  {blogForm.metaDesc || blogForm.excerpt || 'Article summary description snippet...'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: CONTACT INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">Contact & Quick Inquiry Messages</h2>
                      <p className="admin-subtitle">Patient messages submitted via the website contact form.</p>
                    </div>
                  </div>

                  {inquiries.length > 0 ? (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name & Phone</th>
                            <th>Reported Symptoms</th>
                            <th>Preferred Time</th>
                            <th>Submission Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries.map((inq) => (
                            <tr key={inq._id}>
                              <td>
                                <strong>{inq.name}</strong>
                                <div className="table-sub-text">{inq.phone}</div>
                              </td>
                              <td>{inq.condition}</td>
                              <td>{inq.preferredTime}</td>
                              <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-block">
                      <div className="empty-state-icon-wrap">
                        <MessageSquare size={32} />
                      </div>
                      <h3>No Contact Messages</h3>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: SYSTEM SETTINGS */}
              {activeTab === 'settings' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2 className="admin-panel-title">System Settings & Clinic Information</h2>
                      <p className="admin-subtitle">Update clinic contact numbers, helpline, address, and business hours.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="booking-form-body">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Clinic Name</label>
                        <input
                          type="text"
                          required
                          value={settings.clinicName}
                          onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Primary Phone</label>
                        <input
                          type="text"
                          required
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Urgent Emergency Helpline</label>
                        <input
                          type="text"
                          required
                          value={settings.emergencyHelpline}
                          onChange={(e) => setSettings({ ...settings, emergencyHelpline: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Contact Email</label>
                        <input
                          type="email"
                          required
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Clinic Address</label>
                      <input
                        type="text"
                        required
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Business Operating Hours</label>
                      <input
                        type="text"
                        required
                        value={settings.businessHours}
                        onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Website Header Announcement Banner</label>
                      <input
                        type="text"
                        value={settings.siteAnnouncement}
                        onChange={(e) => setSettings({ ...settings, siteAnnouncement: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-teal">
                      Save System Settings
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Onboard New Doctor Modal */}
      {doctorModalOpen && (
        <div className="modal-backdrop" onClick={() => setDoctorModalOpen(false)}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div className="booking-modal-header" style={{ marginBottom: '1.25rem' }}>
              <h3>Onboard New Physiotherapist</h3>
              <button className="modal-close-btn" onClick={() => setDoctorModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateDoctorSubmit} className="booking-form-body">
              <div className="form-group">
                <label>Doctor Full Name *</label>
                <input type="text" required placeholder="e.g. Dr. Neha Sharma" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Qualification *</label>
                <input type="text" required value={newDoctor.qualification} onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <input type="text" required value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Consultation Fee *</label>
                <input type="text" required value={newDoctor.consultationFee} onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-teal" style={{ width: '100%', marginTop: '1rem' }}>Create Doctor Profile</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {serviceModalOpen && (
        <div className="modal-backdrop" onClick={() => setServiceModalOpen(false)}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div className="booking-modal-header" style={{ marginBottom: '1.25rem' }}>
              <h3>Add New Treatment Service</h3>
              <button className="modal-close-btn" onClick={() => setServiceModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateServiceSubmit} className="booking-form-body">
              <div className="form-group">
                <label>Service Title *</label>
                <input type="text" required placeholder="e.g. Class IV Laser Therapy" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Duration *</label>
                <input type="text" required value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input type="text" required value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea rows={3} required value={newService.desc} onChange={(e) => setNewService({ ...newService, desc: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <button type="submit" className="btn btn-teal" style={{ width: '100%', marginTop: '1rem' }}>Create Treatment Service</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Testimonial Modal */}
      {testimonialModalOpen && (
        <div className="modal-backdrop" onClick={() => setTestimonialModalOpen(false)}>
          <div className="booking-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div className="booking-modal-header" style={{ marginBottom: '1.25rem' }}>
              <h3>Add Patient Testimonial</h3>
              <button className="modal-close-btn" onClick={() => setTestimonialModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateTestimonialSubmit} className="booking-form-body">
              <div className="form-group">
                <label>Patient Name *</label>
                <input type="text" required value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Condition / Role *</label>
                <input type="text" required placeholder="e.g. ACL Recovery Patient" value={newTestimonial.role} onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Testimonial Quote *</label>
                <textarea rows={3} required value={newTestimonial.content} onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <button type="submit" className="btn btn-teal" style={{ width: '100%', marginTop: '1rem' }}>Publish Testimonial</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
