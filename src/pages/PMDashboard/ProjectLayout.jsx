// // src/components/layouts/ProjectLayout.jsx
// import React from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { logoutUser } from "../../api/auth";

// const ProjectLayout = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       {/* Common navigation/header for all project manager pages */}
//       <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
//         <button onClick={() => navigate('/project-dashboard')}>Dashboard</button>
//         <button onClick={() => navigate('/submission-list')}>Submissions</button>
//         <button
//           onClick={async () => {
//             await logoutUser();
//             window.location.href = "/";
//           }}
//           style={{ float: 'right' }}
//         >
//           Logout
//         </button>
//       </nav>
      
//       {/* This is where the child routes will render */}
//       <Outlet />
//     </div>
//   );
// };

// export default ProjectLayout;

// src/components/layouts/ProjectLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from "../../api/auth";
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  User,
  Settings,
  Calendar,
  Clock
} from 'lucide-react';

const ProjectLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get project manager info
  const [projectManager, setProjectManager] = useState({ name: '', full_name: '' });
  const [activeProject, setActiveProject] = useState('');

  useEffect(() => {
    // Load project manager info
    const pm = JSON.parse(localStorage.getItem("projectManager"));
    if (pm) {
      setProjectManager(pm);
    }
    
    // Load active project
    const project = localStorage.getItem("selectedProject");
    if (project) {
      setActiveProject(project);
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: '/project-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/submission-list', label: 'Submissions', icon: FileText },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="project-layout">
      {/* Animated Background - Full window */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="noise-overlay"></div>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation - Full height */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <h1 className="logo-text">PM<span>Portal</span></h1>
          </div>
          <div className="date-display">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive(item.path) && <ChevronRight size={16} className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="user-profile-section">
          <div className="user-preview">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <p className="user-name">
                {projectManager.full_name || projectManager.name || 'Project Manager'}
              </p>
              <p className="user-role">
                {activeProject ? (
                  <>
                    <span className="project-badge">{activeProject}</span>
                    <span className="role-badge">PM</span>
                  </>
                ) : (
                  'Project Manager'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <button className="icon-btn">
            <Settings size={18} />
          </button>
        </div>

        {/* Logout Button - Fixed at bottom */}
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
      </aside>

      {/* Main Content Area - Full remaining height */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-indicator">
            <span className="current-page">
              {navigationItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </span>
          </div>
          <div className="top-bar-actions">
            <div className="time-display">
              <Clock size={16} />
              <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span>System Online</span>
            </div>
          </div>
        </div>

        {/* Outlet with animation - Full remaining height */}
        <div className="outlet-container">
          <Outlet />
        </div>
      </main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          width: 100%;
        //   overflow: hidden;
        }

        .project-layout {
          height: 100vh;
          width: 90vw;
          display: flex;
          position: relative;
          background: #0a0a0f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          overflow: hidden;
        }

        /* Animated Background - Full window */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #3b1e66 0%, #2a1b3d 100%);
          bottom: -200px;
          right: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, 50px) scale(1.1); }
          50% { transform: translate(0, 100px) scale(1); }
          75% { transform: translate(-50px, 50px) scale(0.9); }
        }

        /* Sidebar - Full height */
        .sidebar {
          width: 280px;
          height: 100vh;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          overflow-y: auto;
        }

        /* Hide scrollbar for sidebar */
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 0;
            bottom: 0;
            z-index: 1000;
            height: 100vh;
            transition: left 0.3s ease;
          }

          .sidebar.mobile-open {
            left: 0;
          }

          .mobile-menu-btn {
            display: flex;
          }
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .logo-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .logo-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          filter: blur(20px);
          opacity: 0.3;
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .logo-text {
          position: relative;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .logo-text span {
          font-weight: 300;
          opacity: 0.8;
        }

        .date-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .sidebar-nav {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          color: white;
          background: rgba(102, 126, 234, 0.2);
        }

        .active-indicator {
          margin-left: auto;
          opacity: 0.5;
        }

        /* User Profile Section */
        .user-profile-section {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .user-preview {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .project-badge {
          background: rgba(102, 126, 234, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: #a5b4fc;
          font-weight: 500;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .role-badge {
          background: rgba(16, 185, 129, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: #10b981;
          font-weight: 500;
        }

        /* Quick Actions */
        .quick-actions {
          padding: 1rem 1.5rem;
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .icon-btn {
          flex: 1;
          padding: 0.625rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        /* Logout Container */
        .logout-container {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.875rem;
          background: #dc2626;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #ef4444;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        /* Main Content - Full remaining height */
        .main-content {
          flex: 1;
          height: 100vh;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.2);
          overflow: hidden;
          max-width: calc(100vw - 280px); /* Prevent content from going too far */
        }

        .top-bar {
          padding: 1rem 2rem;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          width: 100%;
        }

        .page-indicator {
          display: flex;
          align-items: center;
        }

        .current-page {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          position: relative;
          padding-left: 1rem;
        }

        .current-page::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .time-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 20px;
          color: #10b981;
          font-size: 0.85rem;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Outlet Container - Takes remaining height and scrolls */
        .outlet-container {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          height: calc(100vh - 73px);
          width: 100%;
          max-width: 100%;
        }

        /* Ensure content inside outlet doesn't overflow */
        .outlet-container > * {
          max-width: 100%;
        }

        /* Scrollbar styling for outlet */
        .outlet-container::-webkit-scrollbar {
          width: 8px;
        }

        .outlet-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .outlet-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .outlet-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          width: 45px;
          height: 45px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ProjectLayout;