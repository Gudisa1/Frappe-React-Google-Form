// pages/HR/HRLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiCalendar,
  FiActivity,
  FiShield,
  FiAlertTriangle,
  FiLogOut,
  FiUser,
  FiSettings,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiBriefcase,
  FiDollarSign,
  FiHeart,
  FiClock,
  FiFileText,
  FiGrid,
  FiPlus
} from 'react-icons/fi';
import './HRLayout.css';
import { logoutUser } from "../../api/auth";
import { 
 
  LogOut, 
 
} from 'lucide-react';

const HRLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const menuItems = [
    { 
      path: '/hr', 
      name: 'Dashboard', 
      icon: FiHome,
      description: 'Overview & metrics'
    },
    { 
      path: '/hr/employee/create', 
      name: 'Add New Employee', 
      icon: FiUsers,
      description: 'Manage staff records'
    },
    { 
      path: '/hr/asset', 
      name: 'Create Asset', 
      icon: FiUsers,
      description: 'Manage Asset records'
    },
    { 
      path: '/hr/assetlist', 
      name: 'Asset List', 
      icon: FiGrid,
      description: 'View all assets'
    },
  ];


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => 
      location.pathname === item.path || 
      (item.path !== '/hr' && location.pathname.startsWith(item.path))
    );
    return currentItem?.name || 'HR Management';
  };

  return (
    <div className="hr-layout">
      {/* Mobile Overlay */}
      {(mobileMenuOpen) && (
        <div className="mobile-overlay" onClick={toggleMobileMenu} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'expanded' : 'collapsed'} ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-logo">
              <FiBriefcase size={24} />
            </div>
            {sidebarOpen && (
              <div className="brand-info">
                <span className="brand-name">HR & Asset</span>
                <span className="brand-version">v2.0.0</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar-wrapper">
            <div className="user-avatar">
              <FiUser size={24} />
            </div>
            <span className="user-status online" />
          </div>
          {sidebarOpen && (
            <div className="user-details">
              <span className="user-fullname">HR Manager</span>
              <span className="user-email">hr@company.com</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">
              {sidebarOpen && <span>MAIN MENU</span>}
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/hr' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-item-icon">
                    <Icon size={20} />
                  </div>
                  {sidebarOpen && (
                    <div className="nav-item-content">
                      <span className="nav-item-label">{item.name}</span>
                      <span className="nav-item-description">{item.description}</span>
                    </div>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="nav-item-indicator" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {sidebarOpen ? (
            <>
              <button className="footer-button">
                <FiSettings size={18} />
                <span>Settings</span>
              </button>
               <div className="logout-container">
          <button
            onClick={async () => {
              await logoutUser();
              window.location.href = "/";
            }}
            className="logout-btn"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
            </>
          ) : (
            <>
              <button className="footer-button collapsed">
                <FiSettings size={18} />
              </button>
              <button className="footer-button collapsed logout">
                <FiLogOut size={18} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Top Header */}
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <FiMenu size={24} />
            </button>
            
            {/* Page Title & Breadcrumb */}
            <div className="page-info">
              <h1 className="page-title">{getPageTitle()}</h1>
              <div className="breadcrumb">
                <Link to="/hr" className="breadcrumb-link">HR</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{getPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            {/* Search */}
            

          

            {/* Notifications */}
            <div className="notifications">
              <button className="notification-btn">
                <FiBell size={20} />
                <span className="notification-badge">3</span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="profile-menu">
              <button 
                className="profile-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
              >
                <div className="profile-avatar">
                  <FiUser size={16} />
                </div>
                <div className="profile-info">
                  <span className="profile-name">HR Manager</span>
                  <span className="profile-role">Administrator</span>
                </div>
                <FiChevronDown className={`profile-chevron ${profileDropdownOpen ? 'open' : ''}`} size={16} />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user">
                      <div className="dropdown-avatar">
                        <FiUser size={20} />
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">HR Manager</span>
                        <span className="dropdown-user-email">hr@company.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-body">
                    <Link to="/hr/profile" className="dropdown-item">
                      <FiUser size={16} />
                      <span>Your Profile</span>
                    </Link>
                    <Link to="/hr/settings" className="dropdown-item">
                      <FiSettings size={16} />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="dropdown-footer">
                    <button className="dropdown-item logout">
                      <FiLogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HRLayout;