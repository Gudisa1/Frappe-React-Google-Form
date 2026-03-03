// components/Navigation.jsx - Updated to include layout structure
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardIcon, 
  FileTextIcon, 
  PaperPlaneIcon, 
  CheckCircledIcon,
  Pencil2Icon,
  CubeIcon,
  BellIcon,
  BarChartIcon
} from '@radix-ui/react-icons';
import { Flex, Container } from '@radix-ui/themes';

const Navigation = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/mr-dashboard', icon: <DashboardIcon />, label: 'Dashboard', key: 'dashboard' },
    { path: '/mr-dashboard/forms', icon: <FileTextIcon />, label: 'Form Builder', key: 'forms' },
    { path: '/mr-dashboard/assign', icon: <PaperPlaneIcon />, label: 'Assign Forms', key: 'assign' },
    { path: '/mr-dashboard/submissions', icon: <CheckCircledIcon />, label: 'Submissions', key: 'submissions' },
    { path: '/mr-dashboard/edit-forms', icon: <Pencil2Icon />, label: 'Edit Forms', key: 'edit-forms' },
    { path: '/mr-dashboard/projects', icon: <CubeIcon />, label: 'Projects', key: 'projects' },
    { path: '/mr-dashboard/notifications', icon: <BellIcon />, label: 'Notifications', key: 'notifications' },
    { path: '/mr-dashboard/analytics', icon: <BarChartIcon />, label: 'Analytics', key: 'analytics' },
    { path: '/mr-dashboard/projects', icon: <BarChartIcon />, label: 'Projects', key: 'projects' },
  ];

  return (
    <div className="mr-dashboard">
      <Flex gap="4" className="dashboard-layout">
        {/* Navigation Sidebar */}
        <div className="dashboard-sidebar">
          <nav className="navigation">
            <div className="navigation-header">
              <h3>M&R Manager</h3>
              <p className="text-sm text-gray-400">Data Collection Module</p>
            </div>
            
            <div className="navigation-items">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <Container size="3" className="dashboard-container">
            {children}
          </Container>
        </div>
      </Flex>
    </div>
  );
};

export default Navigation;