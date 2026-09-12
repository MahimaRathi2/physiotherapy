import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BookingModal from '../booking/BookingModal';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.autoOpenBooking) {
      setIsBookingModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const handleBookVisitClick = (bookingType = 'in-person', doctor = null, serviceName = null) => {
    if (!user) {
      navigate('/login', {
        state: {
          fromBooking: true,
          returnUrl: location.pathname,
          bookingType,
          preselectedDoctor: doctor,
          serviceName
        }
      });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const getDashboardPath = (role) => {
    if (role === 'doctor') return '/doctor-dashboard';
    if (role === 'admin') return '/admin';
    return '/patient-dashboard';
  };

  const dashboardPath = user ? getDashboardPath(user.role) : '/patient-dashboard';

  return (
    <>
      <header className="site-header">
        <nav className="main-nav">
          <div className="container nav-container">
            {/* Logo Section */}
            <Link to="/" className="logo-brand" onClick={handleNavClick}>
              <div className="logo-badge-wrap">
                <img 
                  src="/images/SATYA.jpeg" 
                  alt="SATYA Physiotherapy Center Logo" 
                  className="clinic-logo"
                />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <ul className="nav-links">
              <li><NavLink to="/" end onClick={handleNavClick}>Home</NavLink></li>
              <li><NavLink to="/about" onClick={handleNavClick}>About</NavLink></li>
              <li><NavLink to="/services" onClick={handleNavClick}>Services</NavLink></li>
              <li><NavLink to="/why-satya" onClick={handleNavClick}>Why Satya</NavLink></li>
              <li><NavLink to="/stories" onClick={handleNavClick}>Stories</NavLink></li>
              <li><NavLink to="/contact" onClick={handleNavClick}>Contact</NavLink></li>
              {user && (
                <li>
                  <NavLink to={dashboardPath} onClick={handleNavClick} style={{ color: 'var(--teal)', fontWeight: '600' }}>
                    My Dashboard
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Nav Actions */}
            <div className="nav-actions">
              {user ? (
                <div className="user-nav-badge">
                  <Link to={dashboardPath} onClick={handleNavClick} className="btn btn-outline-white nav-btn" style={{ padding: '0.45rem 0.85rem' }}>
                    <User size={15} />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="btn btn-outline-white nav-btn"
                  style={{ padding: '0.45rem 0.85rem' }}
                >
                  <User size={15} />
                  <span>Sign In</span>
                </Link>
              )}

              <button
                className="btn btn-teal nav-btn"
                onClick={() => handleBookVisitClick()}
              >
                <span>Book a Visit</span>
                <ArrowUpRight size={16} />
              </button>

              <button 
                className="mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <ul>
                <li><NavLink to="/" end onClick={handleNavClick}>Home</NavLink></li>
                <li><NavLink to="/about" onClick={handleNavClick}>About</NavLink></li>
                <li><NavLink to="/services" onClick={handleNavClick}>Services</NavLink></li>
                <li><NavLink to="/why-satya" onClick={handleNavClick}>Why Satya</NavLink></li>
                <li><NavLink to="/stories" onClick={handleNavClick}>Stories</NavLink></li>
                <li><NavLink to="/contact" onClick={handleNavClick}>Contact</NavLink></li>
                {user ? (
                  <>
                    <li>
                      <NavLink to={dashboardPath} onClick={handleNavClick} style={{ color: 'var(--teal)', fontWeight: 'bold' }}>
                        My Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <button
                        className="btn btn-outline-white"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => {
                          logout();
                          handleNavClick();
                        }}
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="btn btn-outline-white"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handleNavClick}
                    >
                      Sign In / Register
                    </Link>
                  </li>
                )}
                <li>
                  <button 
                    className="btn btn-teal"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      handleNavClick();
                      handleBookVisitClick();
                    }}
                  >
                    <span>Book a Visit</span> <ArrowUpRight size={16} />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      {/* Dual Option Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default Header;
