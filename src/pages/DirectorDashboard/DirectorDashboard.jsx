import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAssets, 
  getEmployees, 
  getProjects,
} from '../../api/hrapi';
import { fetchSubmissions as getSubmissions } from '../../api/datacollection';
import './DirectorDashboard.css';

const DirectorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    submissions: { total: 0, pending: 0, approved: 0, rejected: 0 },
    employees: { total: 0, active: 0, newHires: 0, onLeave: 0 },
    assets: { total: 0, working: 0, repair: 0, damaged: 0, lost: 0, disposed: 0 },
    projects: { total: 0, active: 0 }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const menuItems = [
    { name: 'Submissions', path: '/director-submissions', icon: '📋', color: '#3b82f6', description: 'Review and manage all project submissions' },
    { name: 'Employees', path: '/director-employee', icon: '👥', color: '#10b981', description: 'View employee records and performance' },
    { name: 'Assets', path: '/director-asset', icon: '💻', color: '#8b5cf6', description: 'Track company assets and inventory' },
    { name: 'Existing Forms', path: '/director-existing-forms', icon: '📄', color: '#f59e0b', description: 'Access and manage existing forms' }
  ];

  useEffect(() => {
    fetchDashboardData();
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [assetsData, employeesData, projectsData, submissionsData] = await Promise.all([
        getAssets().catch(() => []),
        getEmployees().catch(() => []),
        getProjects().catch(() => []),
        getSubmissions().catch(() => [])
      ]);

      const workingAssets = assetsData.filter(a => a?.condition === 'working').length;
      const repairAssets = assetsData.filter(a => a?.condition === 'repair').length;
      const damagedAssets = assetsData.filter(a => a?.condition === 'damaged').length;
      const lostAssets = assetsData.filter(a => a?.condition === 'lost').length;
      const disposedAssets = assetsData.filter(a => a?.condition === 'disposed').length;

      const activeEmployees = employeesData.filter(e => e?.status === 'Active').length;
      const onLeaveEmployees = employeesData.filter(e => e?.status === 'On Leave' || e?.status === 'Leave').length;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newHires = employeesData.filter(e => {
        if (!e?.date_of_joining && !e?.employment_start_date) return false;
        const joinDate = new Date(e?.date_of_joining || e?.employment_start_date);
        return joinDate >= thirtyDaysAgo;
      }).length;

      const pendingSubmissions = submissionsData.filter(s => s?.status === 'Pending' || s?.status === 'pending').length;
      const approvedSubmissions = submissionsData.filter(s => s?.status === 'Approved' || s?.status === 'approved').length;
      const rejectedSubmissions = submissionsData.filter(s => s?.status === 'Rejected' || s?.status === 'rejected').length;

      const activeProjects = projectsData.filter(p => p?.status === 'Active' || p?.status === 'active').length;

      setStats({
        submissions: {
          total: submissionsData.length || 0,
          pending: pendingSubmissions,
          approved: approvedSubmissions,
          rejected: rejectedSubmissions
        },
        employees: {
          total: employeesData.length || 0,
          active: activeEmployees,
          newHires: newHires,
          onLeave: onLeaveEmployees
        },
        assets: {
          total: assetsData.length || 0,
          working: workingAssets,
          repair: repairAssets,
          damaged: damagedAssets,
          lost: lostAssets,
          disposed: disposedAssets
        },
        projects: {
          total: projectsData.length || 0,
          active: activeProjects
        }
      });

      const activities = [];
      
      const recentEmployees = [...employeesData]
        .sort((a, b) => new Date(b?.modified || b?.creation) - new Date(a?.modified || a?.creation))
        .slice(0, 2);
      
      recentEmployees.forEach(emp => {
        activities.push({
          id: `emp-${emp?.name}`,
          action: `New employee record: ${emp?.employee_name || emp?.first_name || ''} ${emp?.last_name || ''}`,
          user: emp?.employee_name || 'System',
          time: getRelativeTime(new Date(emp?.modified || emp?.creation || Date.now())),
          type: 'success',
          icon: '👤'
        });
      });

      const recentAssets = [...assetsData]
        .sort((a, b) => new Date(b?.modified || b?.creation) - new Date(a?.modified || a?.creation))
        .slice(0, 2);
      
      recentAssets.forEach(asset => {
        activities.push({
          id: `asset-${asset?.name}`,
          action: `Asset ${asset?.condition === 'working' ? 'added' : 'updated'}: ${asset?.asset_name || ''}`,
          user: asset?.owner || 'System',
          time: getRelativeTime(new Date(asset?.modified || asset?.creation || Date.now())),
          type: asset?.condition === 'repair' ? 'warning' : 'info',
          icon: '💻'
        });
      });

      const recentSubmissions = [...submissionsData]
        .sort((a, b) => new Date(b?.modified || b?.creation) - new Date(a?.modified || a?.creation))
        .slice(0, 2);
      
      recentSubmissions.forEach(sub => {
        activities.push({
          id: `sub-${sub?.name}`,
          action: `Submission ${sub?.status || 'received'}: ${sub?.title || 'Project submission'}`,
          user: sub?.submitted_by || 'Unknown',
          time: getRelativeTime(new Date(sub?.modified || sub?.creation || Date.now())),
          type: sub?.status === 'pending' ? 'warning' : 'info',
          icon: '📋'
        });
      });

      setRecentActivities(activities.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date) => {
    if (!date || isNaN(date.getTime())) return 'Just now';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className="stat-card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-inner">
        <div className="stat-icon-wrapper" style={{ background: `${color}15` }}>
          <span className="stat-icon">{icon}</span>
        </div>
        <div className="stat-content">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">
            {loading ? '...' : (value?.toLocaleString() || 0)}
          </h3>
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, subtitle, icon, color, onClick }) => (
    <div className="metric-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="metric-icon" style={{ background: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className="metric-info">
        <h4 className="metric-title">{title}</h4>
        <p className="metric-value">{loading ? '...' : (value || 0)}</p>
        {subtitle && <span className="metric-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const handleNavigation = (path, filter = null) => {
    if (filter) {
      navigate(`${path}?filter=${filter}`);
    } else {
      navigate(path);
    }
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const completionRate = stats.submissions.total > 0 
    ? Math.round((stats.submissions.approved / stats.submissions.total) * 100)
    : 0;

  const utilizationRate = stats.assets.total > 0
    ? Math.round((stats.assets.working / stats.assets.total) * 100)
    : 0;

  const employeeEngagement = stats.employees.total > 0
    ? Math.round((stats.employees.active / stats.employees.total) * 100)
    : 0;

  return (
    <div className="director-dashboard">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="welcome-section">
              <span className="welcome-emoji">👋</span>
              <div>
                <h1 className="welcome-title">{greeting}, Director!</h1>
                <p className="welcome-subtitle">Welcome to your management dashboard</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="datetime-card">
              <div className="date-section">
                <span className="date-icon">📅</span>
                <span className="date-text">{formatDate()}</span>
              </div>
              <div className="time-section">
                <span className="time-icon">🕐</span>
                <span className="time-text">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard 
            title="Total Submissions" 
            value={stats.submissions.total}
            icon="📋"
            color="#3b82f6"
            onClick={() => handleNavigation('/director-submissions')}
          />
          <StatCard 
            title="Total Employees" 
            value={stats.employees.total}
            icon="👥"
            color="#10b981"
            onClick={() => handleNavigation('/director-employee')}
          />
          <StatCard 
            title="Total Assets" 
            value={stats.assets.total}
            icon="💻"
            color="#8b5cf6"
            onClick={() => handleNavigation('/director-asset')}
          />
          <StatCard 
            title="Active Projects" 
            value={stats.projects.active}
            icon="🏗️"
            color="#f59e0b"
            onClick={() => handleNavigation('/director-submissions')}
          />
        </div>

        {/* Detailed Metrics Section */}
        <div className="metrics-section">
          <div className="metrics-card">
            <div className="metrics-header">
              <h3>Submission Overview</h3>
              <span className="metrics-badge">{stats.submissions.total} Total</span>
            </div>
            <div className="metrics-grid">
              <MetricCard 
                title="Pending"
                value={stats.submissions.pending}
                icon="⏳"
                color="#f59e0b"
                onClick={() => handleNavigation('/director-submissions', 'pending')}
              />
              <MetricCard 
                title="Approved"
                value={stats.submissions.approved}
                icon="✅"
                color="#10b981"
                onClick={() => handleNavigation('/director-submissions', 'approved')}
              />
              <MetricCard 
                title="Rejected"
                value={stats.submissions.rejected}
                icon="❌"
                color="#ef4444"
                onClick={() => handleNavigation('/director-submissions', 'rejected')}
              />
              <MetricCard 
                title="Completion Rate"
                value={`${completionRate}%`}
                icon="📊"
                color="#8b5cf6"
              />
            </div>
          </div>

          <div className="metrics-card">
            <div className="metrics-header">
              <h3>Employee Insights</h3>
              <span className="metrics-badge">{stats.employees.total} Total</span>
            </div>
            <div className="metrics-grid">
              <MetricCard 
                title="Active"
                value={stats.employees.active}
                icon="💪"
                color="#10b981"
                onClick={() => handleNavigation('/director-employee', 'active')}
              />
              <MetricCard 
                title="New Hires"
                value={stats.employees.newHires}
                icon="🎉"
                color="#3b82f6"
                subtitle="Last 30 days"
                onClick={() => handleNavigation('/director-employee', 'new')}
              />
              <MetricCard 
                title="On Leave"
                value={stats.employees.onLeave}
                icon="🏖️"
                color="#f59e0b"
                onClick={() => handleNavigation('/director-employee', 'leave')}
              />
              <MetricCard 
                title="Engagement"
                value={`${employeeEngagement}%`}
                icon="📈"
                color="#8b5cf6"
              />
            </div>
          </div>

          <div className="metrics-card">
            <div className="metrics-header">
              <h3>Asset Status</h3>
              <span className="metrics-badge">{stats.assets.total} Total</span>
            </div>
            <div className="metrics-grid">
              <MetricCard 
                title="Working"
                value={stats.assets.working}
                icon="✅"
                color="#10b981"
                onClick={() => handleNavigation('/director-asset', 'working')}
              />
              <MetricCard 
                title="Under Repair"
                value={stats.assets.repair}
                icon="🔧"
                color="#f59e0b"
                onClick={() => handleNavigation('/director-asset', 'repair')}
              />
              <MetricCard 
                title="Damaged"
                value={stats.assets.damaged}
                icon="⚠️"
                color="#ef4444"
                onClick={() => handleNavigation('/director-asset', 'damaged')}
              />
              <MetricCard 
                title="Utilization"
                value={`${utilizationRate}%`}
                icon="📊"
                color="#8b5cf6"
              />
            </div>
          </div>
        </div>

        {/* Menu Navigation Section */}
        <div className="menu-section">
          <h2 className="section-title">Quick Access Modules</h2>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="menu-card"
              >
                <div className="menu-card-content">
                  <div className="menu-icon-wrapper" style={{ background: `${item.color}15` }}>
                    <span className="menu-icon">{item.icon}</span>
                  </div>
                  <div className="menu-info">
                    <h3 className="menu-title">{item.name}</h3>
                    <p className="menu-description">{item.description}</p>
                  </div>
                  <div className="menu-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="bottom-section">
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Activity</h3>
              <button className="refresh-btn-small" onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
            <div className="activity-list">
              {loading ? (
                <div className="loading-state">
                  <div className="skeleton-item"></div>
                  <div className="skeleton-item"></div>
                  <div className="skeleton-item"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon" style={{ 
                      background: activity.type === 'success' ? '#10b98115' : 
                                  activity.type === 'warning' ? '#f59e0b15' : '#3b82f615'
                    }}>
                      {activity.icon}
                    </div>
                    <div className="activity-content">
                      <p className="activity-action">{activity.action}</p>
                      <div className="activity-meta">
                        <span className="activity-user">👤 {activity.user}</span>
                        <span className="activity-time">🕐 {activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activities">
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </div>

          <div className="quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="action-btn" onClick={() => handleNavigation('/director-submissions')}>
                <span className="action-icon">📋</span>
                <span className="action-text">Review Submissions</span>
                <span className="action-arrow">→</span>
              </button>
              <button className="action-btn" onClick={() => handleNavigation('/director-employee')}>
                <span className="action-icon">👥</span>
                <span className="action-text">Manage Employees</span>
                <span className="action-arrow">→</span>
              </button>
              <button className="action-btn" onClick={() => handleNavigation('/director-asset')}>
                <span className="action-icon">💻</span>
                <span className="action-text">Check Assets</span>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;